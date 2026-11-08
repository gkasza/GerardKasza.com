import { useEffect, useReducer } from "react";
import { CRYPTO, INDICES, type MarketItem } from "@shared/markets";

const ICONS: Record<string, string> = Object.fromEntries(CRYPTO.map((c) => [c.symbol, c.icon]));

const PLACEHOLDER: MarketItem[] = [
  ...CRYPTO.map((c) => ({ symbol: c.symbol, kind: "crypto" as const, price: null, change: null })),
  ...INDICES.map((i) => ({ symbol: i.symbol, kind: "index" as const, price: null, change: null })),
];

const POLL_INTERVAL = 60_000;

/**
 * loading: no data yet · live: last fetch succeeded
 * stale: had data, latest fetch failed · offline: never got data
 */
export type TickerStatus = "loading" | "live" | "stale" | "offline";

type TickerState = { status: TickerStatus; items: MarketItem[] };
type TickerEvent = { type: "loaded"; items: MarketItem[] } | { type: "failed" };

function tickerReducer(state: TickerState, event: TickerEvent): TickerState {
  switch (event.type) {
    case "loaded": {
      const bySymbol = new Map(event.items.map((i) => [i.symbol, i]));
      return { status: "live", items: state.items.map((p) => bySymbol.get(p.symbol) ?? p) };
    }
    case "failed":
      return { ...state, status: state.status === "live" || state.status === "stale" ? "stale" : "offline" };
  }
}

const STATUS_LABEL: Record<TickerStatus, string> = {
  loading: "Loading",
  live: "Live",
  stale: "Delayed, showing last known prices",
  offline: "Prices unavailable",
};

const DOT_CLASS: Record<TickerStatus, string> = {
  loading: "dot-off",
  live: "dot-live",
  stale: "dot-stale",
  offline: "dot-off",
};

function formatPrice(item: MarketItem): string {
  if (item.price === null) return "---";
  const p = item.price;
  const digits = p >= 1 ? 2 : 4;
  const n = p.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return item.kind === "crypto" ? `$${n}` : n;
}

export function MarketTicker() {
  const [{ status, items }, dispatch] = useReducer(tickerReducer, { status: "loading", items: PLACEHOLDER });

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setInterval> | undefined;

    const load = async () => {
      try {
        const res = await fetch("/api/markets", { signal: controller.signal });
        const data: { items?: MarketItem[] } = res.ok ? await res.json() : {};
        if (!data.items?.length) throw new Error(`markets ${res.status}`);
        dispatch({ type: "loaded", items: data.items });
      } catch {
        if (!controller.signal.aborted) dispatch({ type: "failed" });
      }
    };

    const start = () => {
      clearInterval(timer);
      load();
      timer = setInterval(load, POLL_INTERVAL);
    };
    const onVisibility = () => (document.hidden ? clearInterval(timer) : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const label = STATUS_LABEL[status];

  return (
    <div className="crypto-ticker" role="marquee" aria-label={`Market prices: ${label}`} data-status={status}>
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
      <span className={`crypto-ticker-dot ${DOT_CLASS[status]}`} title={label} aria-hidden="true" />
    </div>
  );
}
