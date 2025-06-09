import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AddStockModal from "../Components/Dashboard/Modals/AddStockModal";
import CreatePortfolioModal from "../Components/Dashboard/Modals/CreatePortfolioModal";
import AddToPortfolioModal from "../Components/Dashboard/Modals/AddToPortfolioModal";
import * as portfolioService from "../Services/portfolioService";
import { useLocation } from "react-router-dom";

export const SharedPortfolioContext = createContext();

const SharedPortfolioProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [createPortfolioModalOpen, setCreatePortfolioModalOpen] =
    useState(false);
  const [addToPortfolioModalOpen, setAddToPortfolioModalOpen] = useState(false);
  const [currentStockData, setCurrentStockData] = useState(null);

  const location = useLocation();
  const [hasLoadedPortfolios, setHasLoadedPortfolios] = useState(false);

  useEffect(() => {
    const shouldLoad = location.pathname.startsWith("/dashboard");

    if (shouldLoad && !hasLoadedPortfolios) {
      const loadPortfolios = async () => {
        setLoading(true);
        try {
          const data = await portfolioService.getUserPortfolios();
          setPortfolios(data);
          if (data.length > 0) setSelectedPortfolioId(data[0].id);
        } catch (err) {
          setError("Failed to load portfolios");
          console.error(err);
        } finally {
          setLoading(false);
          setHasLoadedPortfolios(true);
        }
      };

      loadPortfolios();
    }
  }, [location.pathname, hasLoadedPortfolios]);

  const handleUpdatePortfolio = async (id, portfolioDto) => {
    try {
      await portfolioService.updatePortfolio(id, portfolioDto);
      const updated = await portfolioService.getUserPortfolios();
      setPortfolios(updated);
    } catch (err) {
      setError("Failed to update portfolio");
      console.error(err);
    }
  };

  const handleDeletePortfolio = async (id) => {
    try {
      await portfolioService.deletePortfolio(id);
      const updated = await portfolioService.getUserPortfolios();
      setPortfolios(updated);
      if (selectedPortfolioId === id) setSelectedPortfolioId(null);
    } catch (err) {
      setError("Failed to delete portfolio");
      console.error(err);
    }
  };

  const handleAddStock = async (portfolioId, stockDto) => {
    try {
      await portfolioService.addStockToPortfolio(portfolioId, stockDto);
    } catch (err) {
      setError("Failed to add stock");
      console.error(err);
    }
  };

  const handleRemoveStock = async (portfolioId, stockId) => {
    try {
      await portfolioService.removeStockFromPortfolio(portfolioId, stockId);
    } catch (err) {
      setError("Failed to remove stock");
      console.error(err);
    }
  };

  // Modify handleCreatePortfolio to return the new portfolio object
  const handleCreatePortfolio = async (portfolioDto) => {
    try {
      const newPortfolio = await portfolioService.createPortfolio(portfolioDto);
      const updated = await portfolioService.getUserPortfolios();
      setPortfolios(updated);
      setSelectedPortfolioId(newPortfolio.id);
      return newPortfolio; // Return the created portfolio
    } catch (err) {
      setError("Failed to create portfolio");
      console.error(err);
      throw err; // rethrow error to allow caller to handle it
    }
  };

  // Fixed function - removed unused parameters and unused helper function
  const addStockWithOptionalPortfolio = async ({
    createNew,
    newPortfolioName,
    selectedPortfolioId,
    stockData,
  }) => {
    try {
      if (createNew) {
        // 1. Create new portfolio and wait for the returned portfolio
        const newPortfolio = await handleCreatePortfolio({
          name: newPortfolioName,
        });

        // 2. Add stock to the newly created portfolio using the stockData directly
        await portfolioService.addStockToPortfolio(newPortfolio.id, stockData);
      } else {
        // Just add stock to existing portfolio using the stockData directly
        await portfolioService.addStockToPortfolio(selectedPortfolioId, stockData);
      }

      // Refresh portfolios after adding stock
      const updated = await portfolioService.getUserPortfolios();
      setPortfolios(updated);
    } catch (err) {
      setError("Failed to add stock to portfolio");
      console.error(err);
      throw err; // Re-throw so the modal can handle it
    }
  };

  // Modal Management
  const openAddStockModal = useCallback((stockData = null) => {
    setCurrentStockData(stockData);
    setAddStockModalOpen(true);
  }, []);

  const closeAddStockModal = useCallback(() => {
    setAddStockModalOpen(false);
    setCurrentStockData(null);
  }, []);

  const openCreatePortfolioModal = useCallback(() => {
    setCreatePortfolioModalOpen(true);
  }, []);

  const closeCreatePortfolioModal = useCallback(() => {
    setCreatePortfolioModalOpen(false);
  }, []);

  const openAddToPortfolioModal = useCallback((stockData) => {
    setCurrentStockData(stockData);
    setAddToPortfolioModalOpen(true);
  }, []);

  const closeAddToPortfolioModal = useCallback(() => {
    setAddToPortfolioModalOpen(false);
    setCurrentStockData(null);
  }, []);

  // Utils
  const getPortfolioById = useCallback(
    (id) => portfolios.find((p) => p.id === id),
    [portfolios]
  );

  const getSelectedPortfolio = useCallback(() => {
    return selectedPortfolioId ? getPortfolioById(selectedPortfolioId) : null;
  }, [selectedPortfolioId, getPortfolioById]);

  const formatCurrency = (value) =>
    `$${(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatChange = (change, changePercent) => {
    const prefix = change >= 0 ? "+" : "";
    return `${prefix}${change?.toFixed(2)} (${prefix}${changePercent?.toFixed(
      2
    )}%)`;
  };

  const value = {
    // State
    portfolios,
    selectedPortfolioId,
    loading,
    error,

    // API Handlers
    handleCreatePortfolio,
    handleUpdatePortfolio,
    handleDeletePortfolio,
    handleAddStock,
    handleRemoveStock,
    addStockWithOptionalPortfolio,

    // Modal Controls
    addStockModalOpen,
    createPortfolioModalOpen,
    addToPortfolioModalOpen,
    currentStockData,
    openAddStockModal,
    closeAddStockModal,
    openCreatePortfolioModal,
    closeCreatePortfolioModal,
    openAddToPortfolioModal,
    closeAddToPortfolioModal,

    // Utilities
    getPortfolioById,
    getSelectedPortfolio,
    formatCurrency,
    formatChange,
    setSelectedPortfolioId,

    // Error Control
    setError,
    clearError: () => setError(null),
  };

  return (
    <SharedPortfolioContext.Provider value={value}>
      {children}
      <AddStockModal
        isOpen={addStockModalOpen}
        onClose={closeAddStockModal}
        onAdd={handleAddStock}
        portfolioId={selectedPortfolioId}
        stockData={currentStockData}
      />
      <CreatePortfolioModal
        isOpen={createPortfolioModalOpen}
        onClose={closeCreatePortfolioModal}
        onCreate={handleCreatePortfolio}
      />
      <AddToPortfolioModal
        isOpen={addToPortfolioModalOpen}
        stock={currentStockData}
        onClose={closeAddToPortfolioModal}
        onAdd={handleAddStock}
      />
    </SharedPortfolioContext.Provider>
  );
};

export default SharedPortfolioProvider;

export const useSharedPortfolio = () => {
  const context = useContext(SharedPortfolioContext);
  if (!context) {
    throw new Error(
      "useSharedPortfolio must be used within a SharedPortfolioProvider"
    );
  }
  return context;
};