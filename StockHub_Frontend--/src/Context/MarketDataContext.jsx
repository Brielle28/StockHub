// src/Context/MarketDataContext.js
import { createContext, useContext } from "react";
import axiosInstance from "../Services/axios";

const MarketDataContext = createContext();

export function MarketDataProvider({ children }) {
  // Fetch stock quote for a single symbol
  const getQuote = async (symbol) => {
    const res = await axiosInstance.get(`/api/StockData/${symbol}`);
    return res.data;
  };

  // Fetch historical stock data
  const getHistory = async (symbol, range = "1mo", interval = "1d") => {
    const res = await axiosInstance.get(`/api/StockData/${symbol}/history`, {
      params: { range, interval },
    });
    return res.data;
  };

  // Fetch news articles
  const getNews = async (symbol, limit = 10, offset = 0) => {
    const res = await axiosInstance.get(`/api/StockData/news`, {
      params: { symbol, limit, offset },
    });
    return res.data;
  };

  // Search for stocks
  const searchStocks = async (query, limit = 10) => {
    const res = await axiosInstance.get(`/api/StockData/search`, {
      params: { query, limit },
    });
    return res.data;
  };

  // Get stock prices for multiple symbols
  const getPrices = async (symbols) => {
    const joined = symbols.join(",");
    const res = await axiosInstance.get(`/api/StockData/prices`, {
      params: { symbols: joined },
    });
    return res.data;
  };

  return (
    <MarketDataContext.Provider
      value={{ getQuote, getHistory, getNews, searchStocks, getPrices }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  return useContext(MarketDataContext);
}
