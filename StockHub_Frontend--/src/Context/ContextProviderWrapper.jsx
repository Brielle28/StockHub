// import { AlertsProvider } from "./AlertsContext";
// import AuthProvider from "./AuthContext";
// import { MarketDataProvider } from "./MarketDataContext";
// import SharedPortfolioProvider from "./PortfolioContext";

// const ContextProviderWrapper = ({ children }) => {
//   return (
//     <AuthProvider>
//       <AlertsProvider>
//         <SharedPortfolioProvider>
//           <MarketDataProvider>{children}</MarketDataProvider>
//         </SharedPortfolioProvider>
//       </AlertsProvider>
//     </AuthProvider>
//   );
// };

// export default ContextProviderWrapper;
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