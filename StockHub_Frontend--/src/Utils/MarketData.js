// Mock data - replace with actual API calls
export const mockSearchResults = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 176.28,
    change: 2.45,
    changePercent: 1.41,
    marketCap: "2.8T",
    volume: "45.2M",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 318.34,
    change: -1.23,
    changePercent: -0.38,
    marketCap: "2.4T",
    volume: "28.7M",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 2890.56,
    change: 15.67,
    changePercent: 0.54,
    marketCap: "1.8T",
    volume: "15.3M",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    currentPrice: 3124.89,
    change: -8.45,
    changePercent: -0.27,
    marketCap: "1.6T",
    volume: "22.1M",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    currentPrice: 245.67,
    change: 12.34,
    changePercent: 5.29,
    marketCap: "780B",
    volume: "89.5M",
  },
];

export const mockHistoricalData = [
  {
    date: "2024-05-20",
    open: 172.45,
    high: 178.32,
    low: 171.89,
    close: 176.28,
    volume: 45200000,
  },
  {
    date: "2024-05-21",
    open: 176.28,
    high: 179.45,
    low: 174.12,
    close: 178.9,
    volume: 38900000,
  },
  {
    date: "2024-05-22",
    open: 178.9,
    high: 182.34,
    low: 177.56,
    close: 181.23,
    volume: 42100000,
  },
  {
    date: "2024-05-23",
    open: 181.23,
    high: 183.67,
    low: 179.45,
    close: 180.12,
    volume: 35600000,
  },
  {
    date: "2024-05-24",
    open: 180.12,
    high: 184.89,
    low: 178.34,
    close: 183.45,
    volume: 41800000,
  },
  {
    date: "2024-05-27",
    open: 183.45,
    high: 186.78,
    low: 182.12,
    close: 185.67,
    volume: 39200000,
  },
  {
    date: "2024-05-28",
    open: 185.67,
    high: 188.23,
    low: 184.45,
    close: 187.89,
    volume: 44500000,
  },
];

export const mockNewsData = [
  {
    id: 1,
    headline: "Apple Reports Strong Q2 Earnings Beat Expectations",
    summary:
      "Apple Inc. reported quarterly earnings that exceeded Wall Street expectations, driven by strong iPhone sales and services revenue growth.",
    publishedAt: "2024-05-28T14:30:00Z",
    source: "Reuters",
    url: "#",
  },
  {
    id: 2,
    headline: "New iPhone Models Expected to Drive Next Quarter Growth",
    summary:
      "Analysts predict Apple's upcoming iPhone release will significantly impact Q3 performance with new AI features attracting consumers.",
    publishedAt: "2024-05-28T10:15:00Z",
    source: "Bloomberg",
    url: "#",
  },
  {
    id: 3,
    headline:
      "Apple Expands Services Portfolio with New Subscription Offerings",
    summary:
      "The tech giant announced new service tiers and subscription bundles aimed at increasing recurring revenue streams.",
    publishedAt: "2024-05-27T16:45:00Z",
    source: "TechCrunch",
    url: "#",
  },
];

export const mockQuoteData = {
  symbol: "AAPL",
  name: "Apple Inc.",
  currentPrice: 187.89,
  change: 2.45,
  changePercent: 1.32,
  dayHigh: 188.23,
  dayLow: 184.45,
  open: 185.67,
  previousClose: 185.44,
  volume: 44500000,
  avgVolume: 42100000,
  marketCap: "2.85T",
  peRatio: 28.45,
  eps: 6.59,
  dividend: 0.96,
  dividendYield: 0.51,
  beta: 1.24,
  week52High: 199.62,
  week52Low: 164.08,
};

// Portfolio mock data for add to portfolio functionality
export const mockPortfolios = [
  { id: 1, name: "Tech Stocks", description: "Technology sector investments" },
  {
    id: 2,
    name: "Dividend Stocks",
    description: "Income generating investments",
  },
  {
    id: 3,
    name: "Growth Portfolio",
    description: "High growth potential stocks",
  },
];
