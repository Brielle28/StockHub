import AuthProvider from "./AuthContext";
import { MarketDataProvider } from "./MarketDataContext";
import SharedPortfolioProvider from "./PortfolioContext";

const ContextProviderWrapper = ({ children }) => {
  return (
    <AuthProvider>
      <SharedPortfolioProvider>
        <MarketDataProvider>{children}</MarketDataProvider>
      </SharedPortfolioProvider>
    </AuthProvider>
  );
};

export default ContextProviderWrapper;
