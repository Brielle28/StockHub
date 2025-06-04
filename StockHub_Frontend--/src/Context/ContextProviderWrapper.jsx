import AuthProvider  from "./AuthContext";
import SharedPortfolioProvider from "./PortfolioContext"; 

const ContextProviderWrapper = ({ children }) => {
  return (
    <AuthProvider>
      <SharedPortfolioProvider >
        {children}
      </SharedPortfolioProvider >
    </AuthProvider>
  );
};

export default ContextProviderWrapper;
