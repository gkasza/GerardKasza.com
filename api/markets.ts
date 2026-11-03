import type { VercelRequest, VercelResponse } from "@vercel/node";
// Kept self-contained: Vercel's ESM runtime can't resolve extensionless imports outside api/.
// Symbols must match shared/markets.ts, which the ticker uses for its placeholders.
interface MarketItem {
  symbol: string;
  kind: "crypto" | "index";
  price: number | null;
  change: number | null;
}

const CRYPTO = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
];

const INDICES = [
  { ticker: "^DJI", symbol: "DOW" },
  { ticker: "^GSPC", symbol: "S&P 500" },
  { ticker: "^IXIC", symbol: "NASDAQ" },
  { ticker: "^N225", symbol: "NIKKEI" },
  { ticker: "^FTSE", symbol: "FTSE 100" },
];

const UA = { "User-Agent": "Mozilla/5.0 (compatible; gerardkasza.com market ticker)" };

async function fetchCrypto(): Promise<MarketItem[]> {
  const ids = CRYPTO.map((c) => c.id).join(",");
  const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, { headers: UA });
  if (!r.ok) throw new Error(`coingecko ${r.status}`);
  const data = await r.json();
  return CRYPTO.filter((c) => typeof data[c.id]?.usd === "number").map((c) => ({
    symbol: c.symbol,
    kind: "crypto" as const,
    price: data[c.id].usd,
    change: typeof data[c.id].usd_24h_change === "number" ? data[c.id].usd_24h_change : null,
  }));
}

async function fetchIndex(ticker: string, symbol: string): Promise<MarketItem> {
  const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`, { headers: UA });
  if (!r.ok) throw new Error(`yahoo ${ticker} ${r.status}`);
  const meta = (await r.json())?.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  const prev = meta?.chartPreviousClose ?? meta?.previousClose;
  if (typeof price !== "number") throw new Error(`yahoo ${ticker} no price`);
  return { symbol, kind: "index", price, change: typeof prev === "number" && prev > 0 ? ((price - prev) / prev) * 100 : null };
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const [crypto, indices] = await Promise.all([
    fetchCrypto().catch(() => [] as MarketItem[]),
    Promise.allSettled(INDICES.map((i) => fetchIndex(i.ticker, i.symbol))),
  ]);

  const items: MarketItem[] = [...crypto, ...indices.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))];

  res.setHeader("Cache-Control", items.length ? "public, s-maxage=60, stale-while-revalidate=300" : "no-store");
  return res.status(items.length ? 200 : 502).json({ items, updatedAt: new Date().toISOString() });
}
