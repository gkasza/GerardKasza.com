import { useEffect, useRef, useState, useCallback } from "react";

interface PriceData {
  symbol: string;
  label: string;
  price: number | null;
  prevPrice: number | null;
}

const ASSETS = [
  { id: "bitcoin", symbol: "BTC", label: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", label: "Ethereum" },
  { id: "solana", symbol: "SOL", label: "Solana" },
];

const ICON_MAP: Record<string, string> = {
  BTC: "\u20BF",
  ETH: "\u039E",
  SOL: "\u25C8",
};

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export function CryptoTicker() {
  const [prices, setPrices] = useState<PriceData[]>(
    ASSETS.map((a) => ({ symbol: a.symbol, label: a.label, price: null, prevPrice: null }))
  );
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(
        `wss://ws.coincap.io/prices?assets=${ASSETS.map((a) => a.id).join(",")}`
      );

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as Record<string, string>;
          setPrices((prev) =>
            prev.map((p) => {
              const asset = ASSETS.find((a) => a.symbol === p.symbol);
              if (!asset) return p;
              const newPrice = data[asset.id];
              if (newPrice === undefined) return p;
              return { ...p, prevPrice: p.price, price: parseFloat(newPrice) };
            })
          );
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws.close();

      wsRef.current = ws;
    } catch {
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return (
    <div className="crypto-ticker" aria-label="Live cryptocurrency prices">
      <div className="crypto-ticker-track">
        {/* Duplicate items for seamless loop */}
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
      <span className={`crypto-ticker-dot ${connected ? "dot-live" : "dot-off"}`} title={connected ? "Live" : "Reconnecting"} />
    </div>
  );
}
