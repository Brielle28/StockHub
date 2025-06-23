import { AlertsProvider } from "./AlertsContext";
import { MarketDataProvider } from "./MarketDataContext";
import SharedPortfolioProvider from "./PortfolioContext";

const ContextProviderWrapper = ({ children }) => {
  return (
    <SharedPortfolioProvider>
      <AlertsProvider>
        <MarketDataProvider>
          {children}
        </MarketDataProvider>
      </AlertsProvider>
    </SharedPortfolioProvider>
  );
};

export default ContextProviderWrapper;