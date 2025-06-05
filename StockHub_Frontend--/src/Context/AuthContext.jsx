import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../Services/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    return !decoded || decoded.exp * 1000 < Date.now();
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/StockHub/users/me");
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        if (isTokenExpired(accessToken)) {
          const response = await axiosInstance.post("/StockHub/users/refresh-token", {
            refreshToken,
          });
          localStorage.setItem("accessToken", response.data.accessToken);
        }

        await fetchUser();
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/StockHub/users/login", {
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUser(); // 🚀 get real-time user info from backend
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/StockHub/users/register", {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUser(); // 🚀 get the newly registered user info
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.log("Registration error:", error);
      let message = "Registration failed";
      let errors = error.response?.data?.errors || [];

      return {
        success: false,
        error: message,
        details: errors,
        formattedErrors: errors.map((err) => ({
          code: err.code,
          description: err.description,
        })),
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosInstance.post("/StockHub/users/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      await fetchUser();
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
