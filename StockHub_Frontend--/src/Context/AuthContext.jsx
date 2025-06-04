import { createContext, useContext } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Provider Component
const AuthProvider = ({ children }) => {

  const value = {

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
