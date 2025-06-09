import axiosInstance from "./axios";
const BASE_PATH = "api/portfolios";

// Get all portfolios for the logged in user
export async function getUserPortfolios() {
  const response = await axiosInstance.get(BASE_PATH);
  return response.data;
}

// Get a single portfolio by ID
export async function getPortfolio(id) {
  const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return response.data;
}

// Create a new portfolio
export async function createPortfolio(portfolioDto) {
  const response = await axiosInstance.post(BASE_PATH, portfolioDto);
  return response.data;
}

// Update a portfolio
export async function updatePortfolio(id, portfolioDto) {
  await axiosInstance.put(`${BASE_PATH}/${id}`, portfolioDto);
}

// Delete a portfolio
export async function deletePortfolio(id) {
  await axiosInstance.delete(`${BASE_PATH}/${id}`);
}

// Get stocks in a portfolio
export async function getPortfolioStocks(portfolioId) {
  const response = await axiosInstance.get(`${BASE_PATH}/${portfolioId}/stocks`);
  return response.data;
}

// Add a stock to a portfolio
export async function addStockToPortfolio(portfolioId, stockDto) {
  const response = await axiosInstance.post(`${BASE_PATH}/${portfolioId}/stocks`, stockDto);
  return response.data;
}

// Remove a stock from a portfolio
export async function removeStockFromPortfolio(portfolioId, stockId) {
  await axiosInstance.delete(`${BASE_PATH}/${portfolioId}/stocks/${stockId}`);
}
