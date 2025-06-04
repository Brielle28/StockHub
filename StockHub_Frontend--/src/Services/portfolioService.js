import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/portfolios";

function getAuthHeaders() {
  const token = localStorage.getItem("token"); // or sessionStorage
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// Get all portfolios for the logged in user
export async function getUserPortfolios() {
  const response = await axios.get(API_BASE_URL, getAuthHeaders());
  return response.data;
}

// Get a single portfolio by ID
export async function getPortfolio(id) {
  const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
}

// Create a new portfolio
export async function createPortfolio(portfolioDto) {
  const response = await axios.post(
    API_BASE_URL,
    portfolioDto,
    getAuthHeaders()
  );
  return response.data;
}

// Update a portfolio
export async function updatePortfolio(id, portfolioDto) {
  await axios.put(`${API_BASE_URL}/${id}`, portfolioDto, getAuthHeaders());
}

// Delete a portfolio
export async function deletePortfolio(id) {
  await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
}

// Get stocks in a portfolio
export async function getPortfolioStocks(portfolioId) {
  const response = await axios.get(
    `${API_BASE_URL}/${portfolioId}/stocks`,
    getAuthHeaders()
  );
  return response.data;
}

// Add a stock to a portfolio
export async function addStockToPortfolio(portfolioId, stockDto) {
  const response = await axios.post(
    `${API_BASE_URL}/${portfolioId}/stocks`,
    stockDto,
    getAuthHeaders()
  );
  return response.data;
}

// Remove a stock from a portfolio
export async function removeStockFromPortfolio(portfolioId, stockId) {
  await axios.delete(
    `${API_BASE_URL}/${portfolioId}/stocks/${stockId}`,
    getAuthHeaders()
  );
}
