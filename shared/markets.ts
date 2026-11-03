export interface MarketItem {
  symbol: string;
  kind: "crypto" | "index";
  price: number | null;
  change: number | null;
}

export const CRYPTO = [
  { id: "bitcoin", symbol: "BTC", icon: "₿" },
  { id: "ethereum", symbol: "ETH", icon: "Ξ" },
  { id: "solana", symbol: "SOL", icon: "◈" },
] as const;

export const INDICES = [
  { ticker: "^DJI", symbol: "DOW" },
  { ticker: "^GSPC", symbol: "S&P 500" },
  { ticker: "^IXIC", symbol: "NASDAQ" },
  { ticker: "^N225", symbol: "NIKKEI" },
  { ticker: "^FTSE", symbol: "FTSE 100" },
] as const;
