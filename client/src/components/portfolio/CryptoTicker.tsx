import { useEffect, useRef, useState, useCallback } from "react";

interface PriceData {
  symbol: string;
  price: number | null;
  prevPrice: number | null;
}

const ASSETS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
];

const ICON_MAP: Record<string, string> = {
  BTC: "\u20BF",
  ETH: "\u039E",
  SOL: "\u25C8",
};

const POLL_INTERVAL = 60_000; // 60s — well within CoinGecko free tier limits

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export function CryptoTicker() {
  const [prices, setPrices] = useState<PriceData[]>(
    ASSETS.map((a) => ({ symbol: a.symbol, price: null, prevPrice: null }))
  );
  const [live, setLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = ASSETS.map((a) => a.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      if (!res.ok) return;
      const data = await res.json();

      setPrices((prev) =>
        prev.map((p) => {
          const asset = ASSETS.find((a) => a.symbol === p.symbol);
          if (!asset || !data[asset.id]?.usd) return p;
          return { ...p, prevPrice: p.price, price: data[asset.id].usd };
        })
      );
      setLive(true);
    } catch {
      // silently fail — prices just stay stale
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrices]);

  return (
    <div className="crypto-ticker" aria-label="Live cryptocurrency prices">
      <div className="crypto-ticker-track">
        {[...prices, ...prices].map((p, i) => (
          <span key={`${p.symbol}-${i}`} className="crypto-ticker-item">
            <span className="crypto-ticker-icon">{ICON_MAP[p.symbol]}</span>
            <span className="crypto-ticker-symbol">{p.symbol}</span>
            <span
              className={`crypto-ticker-price ${
                p.price !== null && p.prevPrice !== null
                  ? p.price > p.prevPrice
                    ? "ticker-up"
                    : p.price < p.prevPrice
                      ? "ticker-down"
                      : ""
                  : ""
              }`}
            >
              {p.price !== null ? `$${formatPrice(p.price)}` : "---"}
            </span>
          </span>
        ))}
      </div>
      <span className={`crypto-ticker-dot ${live ? "dot-live" : "dot-off"}`} title={live ? "Live" : "Loading"} />
    </div>
  );
}
