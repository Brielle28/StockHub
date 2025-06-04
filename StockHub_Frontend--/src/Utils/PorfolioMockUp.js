// Mock data
export const mockPortfolios = [
  {
    id: 1,
    name: "Tech Stocks",
    description: "Technology sector investments",
    value: 25436.78,
    dailyChange: 345.67,
    dailyChangePercent: 1.42,
    stockCount: 5,
    totalGainLoss: 3456.78,
    totalGainLossPercent: 15.72
  },
  {
    id: 2,
    name: "Dividend Stocks",
    description: "Income generating investments",
    value: 18234.50,
    dailyChange: -123.45,
    dailyChangePercent: -0.67,
    stockCount: 8,
    totalGainLoss: 1234.56,
    totalGainLossPercent: 7.26
  }
];

export const mockStocks = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", quantity: 15, purchasePrice: 150.25, currentPrice: 176.28, currentValue: 2644.20, gainLoss: 390.45, gainLossPercent: 17.32 },
  { id: 2, symbol: "MSFT", name: "Microsoft Corp.", quantity: 10, purchasePrice: 290.45, currentPrice: 318.34, currentValue: 3183.40, gainLoss: 278.90, gainLossPercent: 9.6 },
  { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", quantity: 5, purchasePrice: 2756.32, currentPrice: 2890.56, currentValue: 14452.80, gainLoss: 671.20, gainLossPercent: 4.87 },
  { id: 4, symbol: "AMZN", name: "Amazon.com Inc.", quantity: 8, purchasePrice: 3245.67, currentPrice: 3124.89, currentValue: 24999.12, gainLoss: -966.24, gainLossPercent: -3.72 },
];

export const mockPerformanceData = [
  { date: '2024-04-01', value: 23654.45 },
  { date: '2024-04-02', value: 23789.12 },
  { date: '2024-04-03', value: 24102.56 },
  { date: '2024-04-04', value: 24056.78 },
  { date: '2024-04-05', value: 24234.45 },
  { date: '2024-04-08', value: 24567.89 },
  { date: '2024-04-09', value: 24789.23 },
  { date: '2024-04-10', value: 25012.67 },
  { date: '2024-04-11', value: 25123.45 },
  { date: '2024-04-12', value: 25346.78 },
  { date: '2024-04-15', value: 25436.78 },
];

export const mockAllocationData = [
  { name: 'AAPL', value: 2644.20, color: '#FF6384' },
  { name: 'MSFT', value: 3183.40, color: '#36A2EB' },
  { name: 'GOOGL', value: 14452.80, color: '#FFCE56' },
  { name: 'AMZN', value: 24999.12, color: '#4BC0C0' },
];
