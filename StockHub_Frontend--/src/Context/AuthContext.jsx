// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import axiosInstance from "../Services/axios";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const decodeToken = (token) => {
//     try {
//       return JSON.parse(atob(token.split(".")[1]));
//     } catch {
//       return null;
//     }
//   };

//   const isTokenExpired = (token) => {
//     const decoded = decodeToken(token);
//     return !decoded || decoded.exp * 1000 < Date.now();
//   };

//   const fetchUser = async () => {
//     const res = await axiosInstance.get("/StockHub/users/me");
//     setUser(res.data);
//     localStorage.setItem("user", JSON.stringify(res.data));
//   };

//   const initAuth = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");

//     if (!accessToken || !refreshToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       if (isTokenExpired(accessToken)) {
//         console.log("Access token expired. Attempting refresh...");

//         const response = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/StockHub/users/refresh-token`,
//           {
//             accessToken: accessToken,
//             refreshToken: refreshToken,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.status === 200 && response.data.accessToken) {
//           localStorage.setItem("accessToken", response.data.accessToken);
//           if (response.data.refreshToken) {
//             localStorage.setItem("refreshToken", response.data.refreshToken);
//           }
//         } else {
//           throw new Error("Invalid response from refresh endpoint");
//         }
//       }

//       await fetchUser();
//       setIsAuthenticated(true);
//     } catch (err) {
//       console.error("Token refresh failed:", err.response?.data || err.message);

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("user");

//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (username, password) => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.post("/StockHub/users/login", {
//         username,
//         password,
//       });

//       const { accessToken, refreshToken } = res.data;
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       await fetchUser();
//       setIsAuthenticated(true);

//       return {
//         success: true,
//         user: res.data.user,
//       };
//     } catch (err) {
//       console.error("Login error:", err.response?.data);
      
//       const errorData = err.response?.data || {};
//       const message = errorData.message || "Login failed";
      
//       // Handle validation errors - could be in different formats
//       let validationErrors = {};
//       if (errorData.errors) {
//         validationErrors = errorData.errors;
//       } else if (errorData.details) {
//         validationErrors = errorData.details;
//       }

//       return {
//         success: false,
//         error: message,
//         validationErrors: validationErrors,
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.post(
//         "/StockHub/users/register",
//         userData
//       );
      
//       const { accessToken, refreshToken } = res.data;
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       await fetchUser();
//       setIsAuthenticated(true);

//       return {
//         success: true,
//         user: res.data.user,
//       };
//     } catch (err) {
//       console.error("Registration error:", err.response?.data);
      
//       const errorData = err.response?.data || {};
//       const message = errorData.message || "Registration failed";
      
//       // Handle validation errors - could be in different formats
//       let validationErrors = {};
//       if (errorData.errors) {
//         validationErrors = errorData.errors;
//       } else if (errorData.details) {
//         validationErrors = errorData.details;
//       } else if (errorData.validationErrors) {
//         validationErrors = errorData.validationErrors;
//       }

//       return {
//         success: false,
//         error: message,
//         validationErrors: validationErrors,
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");

//     try {
//       if (accessToken && refreshToken) {
//         await axiosInstance.post("/StockHub/users/logout", {
//           accessToken,
//           refreshToken,
//         });
//       }
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       localStorage.clear();
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   const refreshUser = async () => {
//     setLoading(true);
//     try {
//       await fetchUser();
//     } catch (err) {
//       console.error("User refresh failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     initAuth();
//   }, []);

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     refreshUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthProvider;

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../Services/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Add this new state to track when auth is ready
  const [authReady, setAuthReady] = useState(false);
  // Add this to expose the access token reactively
  const [accessToken, setAccessToken] = useState(null);

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

  const initAuth = async () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!storedAccessToken || !refreshToken) {
      setLoading(false);
      setAuthReady(true); // Auth is ready even if no token
      return;
    }

    try {
      let validToken = storedAccessToken;

      if (isTokenExpired(storedAccessToken)) {
        console.log("Access token expired. Attempting refresh...");

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/StockHub/users/refresh-token`,
          {
            accessToken: storedAccessToken,
            refreshToken: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.accessToken) {
          validToken = response.data.accessToken;
          localStorage.setItem("accessToken", response.data.accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem("refreshToken", response.data.refreshToken);
          }
        } else {
          throw new Error("Invalid response from refresh endpoint");
        }
      }

      // Set the valid token in state
      setAccessToken(validToken);
      await fetchUser();
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err.message);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      setAccessToken(null);
      logout();
    } finally {
      setLoading(false);
      setAuthReady(true); // Auth initialization is complete
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/StockHub/users/login", {
        username,
        password,
      });

      const { accessToken: newAccessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Update the reactive token state
      setAccessToken(newAccessToken);

      await fetchUser();
      setIsAuthenticated(true);

      return {
        success: true,
        user: res.data.user,
      };
    } catch (err) {
      console.error("Login error:", err.response?.data);
     
      const errorData = err.response?.data || {};
      const message = errorData.message || "Login failed";
     
      let validationErrors = {};
      if (errorData.errors) {
        validationErrors = errorData.errors;
      } else if (errorData.details) {
        validationErrors = errorData.details;
      }

      return {
        success: false,
        error: message,
        validationErrors: validationErrors,
      };
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
     
      const { accessToken: newAccessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Update the reactive token state
      setAccessToken(newAccessToken);

      await fetchUser();
      setIsAuthenticated(true);

      return {
        success: true,
        user: res.data.user,
      };
    } catch (err) {
      console.error("Registration error:", err.response?.data);
     
      const errorData = err.response?.data || {};
      const message = errorData.message || "Registration failed";
     
      let validationErrors = {};
      if (errorData.errors) {
        validationErrors = errorData.errors;
      } else if (errorData.details) {
        validationErrors = errorData.details;
      } else if (errorData.validationErrors) {
        validationErrors = errorData.validationErrors;
      }

      return {
        success: false,
        error: message,
        validationErrors: validationErrors,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const currentAccessToken = accessToken || localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (currentAccessToken && refreshToken) {
        await axiosInstance.post("/StockHub/users/logout", {
          accessToken: currentAccessToken,
          refreshToken,
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null); // Clear the reactive token
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
    authReady, // Expose this to know when auth is initialized
    accessToken, // Expose the reactive access token
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