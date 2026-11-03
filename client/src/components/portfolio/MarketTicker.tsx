import { useEffect, useState } from "react";
import { CRYPTO, INDICES, type MarketItem } from "@shared/markets";

const ICONS: Record<string, string> = Object.fromEntries(CRYPTO.map((c) => [c.symbol, c.icon]));

const PLACEHOLDER: MarketItem[] = [
  ...CRYPTO.map((c) => ({ symbol: c.symbol, kind: "crypto" as const, price: null, change: null })),
  ...INDICES.map((i) => ({ symbol: i.symbol, kind: "index" as const, price: null, change: null })),
];

const POLL_INTERVAL = 60_000;

function formatPrice(item: MarketItem): string {
  if (item.price === null) return "---";
  const p = item.price;
  const digits = p >= 1 ? 2 : 4;
  const n = p.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return item.kind === "crypto" ? `$${n}` : n;
}

export function MarketTicker() {
  const [items, setItems] = useState<MarketItem[]>(PLACEHOLDER);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/markets");
        if (!res.ok) return;
        const data: { items: MarketItem[] } = await res.json();
        if (cancelled || !data.items?.length) return;
        const bySymbol = new Map(data.items.map((i) => [i.symbol, i]));
        setItems((prev) => prev.map((p) => bySymbol.get(p.symbol) ?? p));
        setLive(true);
      } catch {
        // keep showing the last known values
      }
    };
    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="crypto-ticker" role="marquee" aria-label="Live market prices">
      <div className="crypto-ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={`${item.symbol}-${i}`} className="crypto-ticker-item" aria-hidden={i >= items.length || undefined}>
            {ICONS[item.symbol] && <span className="crypto-ticker-icon">{ICONS[item.symbol]}</span>}
            <span className="crypto-ticker-symbol">{item.symbol}</span>
            <span className="crypto-ticker-price">{formatPrice(item)}</span>
            {item.change !== null && (
              <span className={`crypto-ticker-change ${item.change >= 0 ? "ticker-up" : "ticker-down"}`}>
                {item.change >= 0 ? "▲" : "▼"}
                {Math.abs(item.change).toFixed(2)}%
              </span>
            )}
          </span>
        ))}
      </div>
      <span className={`crypto-ticker-dot ${live ? "dot-live" : "dot-off"}`} title={live ? "Live" : "Loading"} />
    </div>
  );
}
