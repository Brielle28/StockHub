import { FiPlus } from "react-icons/fi";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
import PortfolioCard from "./PortfolioCard";
import PortfolioDetails from "./PortfolioDetails";

export default function PortfolioPage() {
  const {
    portfolios,
    selectedPortfolioId,
    setSelectedPortfolioId,
    getSelectedPortfolio,
    openAddStockModal,
    openCreatePortfolioModal
  } = useSharedPortfolio();

  const selectedPortfolio = getSelectedPortfolio();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-300">Your Portfolios</h1>
        <button
          onClick={openCreatePortfolioModal}
          className="mt-4 md:mt-0 px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center justify-center transition-all"
        >
          <FiPlus className="mr-2" /> Create Portfolio
        </button>
      </div>

      {/* If no portfolios exist */}
      {portfolios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#1a1a1a] rounded-xl border border-gray-800">
          <p className="text-lg md:text-xl text-gray-400 mb-4">
            You don't have any portfolios yet, create a new portfolio
          </p>
        </div>
      ) : (
        <>
          {/* Portfolio Cards */}
          <div className="relative mb-6">
            <div className="flex flex-row overflow-x-scroll pb-2 space-x-4 md:gap-4">
              {portfolios.map((portfolio) => (
                <div className="min-w-[240px] md:min-w-[300px]" key={portfolio.id}>
                  <PortfolioCard
                    portfolio={portfolio}
                    onSelect={setSelectedPortfolioId}
                    isSelected={portfolio.id === selectedPortfolioId}
                  />
                </div>
              ))}
            </div>
            {/* Scroll indicator for mobile */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="h-1 w-16 bg-gray-600 rounded-full opacity-75"></div>
            </div>
          </div>

          {/* Selected Portfolio Details */}
          {selectedPortfolio && (
            <PortfolioDetails
              portfolio={selectedPortfolio}
              onShowAddStock={() => openAddStockModal()}
            />
          )}
        </>
      )}
    </div>
  );
}
