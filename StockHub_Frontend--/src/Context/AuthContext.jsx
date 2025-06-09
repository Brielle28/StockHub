import React, { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from '../Services/axiosInstance';
import axios from "axios";
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
    const res = await axiosInstance.get("/StockHub/users/me");
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  // const initAuth = async () => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');

  //   if (!accessToken || !refreshToken) {
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     if (isTokenExpired(accessToken)) {
  //       const res = await axios.post(
  //         `${import.meta.env.VITE_API_BASE_URL}/StockHub/users/refresh-token`,
  //         { accessToken, refreshToken }
  //       );
  //       localStorage.setItem('accessToken', res.data.accessToken);
  //     }

  //     await fetchUser();
  //     setIsAuthenticated(true);
  //   } catch {
  //     logout();
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const initAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      setLoading(false);
      return;
    }

    try {
      if (isTokenExpired(accessToken)) {
        console.log("Access token expired. Attempting refresh...");
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/StockHub/users/refresh-token`,
          {
            accessToken,
            refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Save new token
        localStorage.setItem("accessToken", res.data.accessToken);
      }

      // Now fetch the logged-in user
      await fetchUser();
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/StockHub/users/login", {
        username,
        password,
      });

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUser();
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/StockHub/users/register",
        userData
      );
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUser();
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors || {};
      return {
        success: false,
        error: "Registration failed",
        details: errors,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (accessToken && refreshToken) {
        await axiosInstance.post("/StockHub/users/logout", {
          accessToken,
          refreshToken,
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      await fetchUser();
    } catch (err) {
      console.error("User refresh failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
