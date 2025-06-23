import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AddStockModal from "../Components/Dashboard/Modals/AddStockModal";
import CreatePortfolioModal from "../Components/Dashboard/Modals/CreatePortfolioModal";
// import AddToPortfolioModal from "../Components/Dashboard/Modals/AddToPortfolioModal";
import * as portfolioService from "../Services/portfolioService";
import { useLocation } from "react-router-dom";
import AddToPortfolioMarketModal from "../Components/Dashboard/Modals/AddToPortfolioMarketModal";

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

  const handleCreatePortfolio = async (portfolioDto) => {
    try {
      // Create the portfolio
      await portfolioService.createPortfolio(portfolioDto);

      // Refresh portfolios to get the latest data including the new portfolio
      const updated = await portfolioService.getUserPortfolios();
      setPortfolios(updated);

      // Find the newly created portfolio from the updated list
      // This is more reliable than depending on the API response
      const createdPortfolio = updated.find(
        (p) =>
          p.name === portfolioDto.name &&
          p.description === portfolioDto.description
      );

      if (createdPortfolio) {
        setSelectedPortfolioId(createdPortfolio.id);
        return createdPortfolio;
      } else {
        // Fallback: if we can't find it, return the last portfolio (assuming it's the newest)
        const lastPortfolio = updated[updated.length - 1];
        setSelectedPortfolioId(lastPortfolio.id);
        return lastPortfolio;
      }
    } catch (err) {
      setError("Failed to create portfolio");
      console.error(err);
      throw err;
    }
  };

  const addStockWithOptionalPortfolio = async ({
    createNew,
    newPortfolioName,
    newPortfolioDescription,
    selectedPortfolioId,
    stockData,
    originalStock,
  }) => {
    try {
      let targetPortfolioId;

      if (createNew) {
        console.log("Creating new portfolio with:", {
          name: newPortfolioName,
          description: newPortfolioDescription,
        });

        const newPortfolio = await handleCreatePortfolio({
          name: newPortfolioName,
          description: newPortfolioDescription,
        });

        console.log("New portfolio created:", newPortfolio);

        // Double-check that we have a valid portfolio ID
        if (!newPortfolio || !newPortfolio.id) {
          throw new Error("Failed to create portfolio or get portfolio ID");
        }

        targetPortfolioId = newPortfolio.id;
      } else {
        if (!selectedPortfolioId) {
          throw new Error("No portfolio selected");
        }
        targetPortfolioId = selectedPortfolioId;
      }

      // Ensure we have a valid portfolio ID before proceeding
      if (!targetPortfolioId) {
        throw new Error("Failed to get valid portfolio ID");
      }

      console.log("Target portfolio ID:", targetPortfolioId);

      // Prepare stock data for the backend
      const preparedStockData = {
        symbol: stockData.symbol,
        quantity: stockData.quantity,
        purchasePrice: stockData.purchasePrice,
        purchaseDate: stockData.purchaseDate,
        currentPrice: stockData.currentPrice,
        previousClose: stockData.previousClose,
        companyName:
          stockData.companyName ||
          originalStock?.companyName ||
          originalStock?.name,
        currency: stockData.currency || originalStock?.currency || "USD",
        volume: stockData.volume || originalStock?.volume,
        change: stockData.change || originalStock?.change,
        changePercent: stockData.changePercent || originalStock?.changePercent,
      };

      console.log("Prepared stock data:", preparedStockData);

      // Add stock to the portfolio
      await portfolioService.addStockToPortfolio(
        targetPortfolioId,
        preparedStockData
      );

      // Refresh portfolios after adding stock
      const updated = await portfolioService.getUserPortfolios();
      setPortfolios(updated);

      // Set the portfolio as selected if it was newly created
      if (createNew) {
        setSelectedPortfolioId(targetPortfolioId);
      }
    } catch (err) {
      console.error("Error in addStockWithOptionalPortfolio:", err);
      setError("Failed to add stock to portfolio");
      throw err;
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
      {/* <AddToPortfolioModal
        isOpen={addToPortfolioModalOpen}
        stock={currentStockData}
        onClose={closeAddToPortfolioModal}
        onAdd={handleAddStock}
      /> */}
      <AddToPortfolioMarketModal
        isOpen={addToPortfolioModalOpen}
        stock={currentStockData}
        onClose={closeAddToPortfolioModal}
        onAdd={addStockWithOptionalPortfolio} // Use the correct function
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
