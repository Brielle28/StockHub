// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   useCallback
// } from 'react';
// import * as signalR from '@microsoft/signalr';
// import axiosInstance from '../Services/axios';
// import { useAuth } from './AuthContext'; // Import useAuth

// // Action types
// const ACTIONS = {
//   SET_LOADING: 'SET_LOADING',
//   SET_ACTIVE_ALERTS: 'SET_ACTIVE_ALERTS',
//   SET_TRIGGERED_ALERTS: 'SET_TRIGGERED_ALERTS',
//   ADD_ACTIVE_ALERT: 'ADD_ACTIVE_ALERT',
//   REMOVE_ACTIVE_ALERT: 'REMOVE_ACTIVE_ALERT',
//   ADD_TRIGGERED_ALERT: 'ADD_TRIGGERED_ALERT',
//   SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
//   SET_ERROR: 'SET_ERROR',
//   CLEAR_ERROR: 'CLEAR_ERROR'
// };

// // Initial state
// const initialState = {
//   activeAlerts: [],
//   triggeredAlerts: [],
//   loading: false,
//   connectionStatus: 'disconnected', // 'connected', 'connecting', 'disconnected', 'failed'
//   error: null
// };

// // Reducer
// const alertsReducer = (state, action) => {
//   switch (action.type) {
//     case ACTIONS.SET_LOADING:
//       return { ...state, loading: action.payload };
//     case ACTIONS.SET_ACTIVE_ALERTS:
//       return { ...state, activeAlerts: action.payload };
//     case ACTIONS.SET_TRIGGERED_ALERTS:
//       return { ...state, triggeredAlerts: action.payload };
//     case ACTIONS.ADD_ACTIVE_ALERT:
//       return { ...state, activeAlerts: [...state.activeAlerts, action.payload] };
//     case ACTIONS.REMOVE_ACTIVE_ALERT:
//       return {
//         ...state,
//         activeAlerts: state.activeAlerts.filter(alert => alert.id !== action.payload)
//       };
//     case ACTIONS.ADD_TRIGGERED_ALERT:
//       return {
//         ...state,
//         triggeredAlerts: [action.payload, ...state.triggeredAlerts]
//       };
//     case ACTIONS.SET_CONNECTION_STATUS:
//       return { ...state, connectionStatus: action.payload };
//     case ACTIONS.SET_ERROR:
//       return { ...state, error: action.payload };
//     case ACTIONS.CLEAR_ERROR:
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// };

// // Create context
// const AlertsContext = createContext();

// // Custom hook
// export const useAlerts = () => {
//   const context = useContext(AlertsContext);
//   if (!context) {
//     throw new Error('useAlerts must be used within an AlertsProvider');
//   }
//   return context;
// };

// // Alerts Provider
// export const AlertsProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(alertsReducer, initialState);
//   const connectionRef = React.useRef(null);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   // Get auth state from AuthContext
//   const { accessToken, authReady, isAuthenticated } = useAuth();

//   // Initialize SignalR connection
//   const initializeSignalR = useCallback(async () => {
//     if (!accessToken) {
//       console.log('No access token available for SignalR connection');
//       return;
//     }

//     try {
//       dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connecting' });

//       const connection = new signalR.HubConnectionBuilder()
//         .withUrl(`${API_BASE_URL}/alertsHub`, {
//           accessTokenFactory: () => accessToken
//         })
//         .withAutomaticReconnect()
//         .build();

//       // SignalR connection event handlers
//       connection.onreconnecting(() => {
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connecting' });
//       });

//       connection.onreconnected(() => {
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connected' });
//       });

//       connection.onclose(() => {
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'disconnected' });
//       });

//       // Real-time alert listeners
//       connection.on('AlertTriggered', (triggeredAlert) => {
//         console.log('SignalR: Alert triggered received', triggeredAlert);
//         dispatch({ type: ACTIONS.ADD_TRIGGERED_ALERT, payload: triggeredAlert });
//         dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: triggeredAlert.id });
//       });

//       connection.on('AlertCreated', (newAlert) => {
//         console.log('SignalR: Alert created received', newAlert);
//         dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: newAlert });
//       });

//       connection.on('AlertDeleted', (alertId) => {
//         console.log('SignalR: Alert deleted received', alertId);
//         dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: alertId });
//       });

//       await connection.start();
//       connectionRef.current = connection;
//       dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connected' });
//       console.log('SignalR connection established successfully');
//     } catch (error) {
//       console.error('SignalR Connection Error:', error);
//       dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'failed' });
//       dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to connect to real-time updates' });
//     }
//   }, [API_BASE_URL, accessToken]);

//   // Retry SignalR connection if disconnected
//   useEffect(() => {
//     if (!accessToken) return;

//     const interval = setInterval(() => {
//       const connection = connectionRef.current;
//       if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
//         console.log('🔁 Retrying SignalR connection...');
//         connection.start().catch(console.error);
//       }
//     }, 10000); // every 10 seconds

//     return () => clearInterval(interval);
//   }, [accessToken]);

//   // Fetch active alerts
//   const fetchActiveAlerts = useCallback(async () => {
//     if (!accessToken) {
//       console.log('No access token available for fetching active alerts');
//       return;
//     }

//     try {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: true });
//       const response = await axiosInstance.get('/api/Alerts');
//       dispatch({ type: ACTIONS.SET_ACTIVE_ALERTS, payload: response.data });
//       console.log('Active alerts fetched successfully:', response.data);
//     } catch (error) {
//       console.error('Error fetching active alerts:', error);
//       dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch active alerts' });
//     } finally {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: false });
//     }
//   }, [accessToken]);

//   // Fetch triggered alerts
//   const fetchTriggeredAlerts = useCallback(async () => {
//     if (!accessToken) {
//       console.log('No access token available for fetching triggered alerts');
//       return;
//     }

//     try {
//       const response = await axiosInstance.get('/api/Alerts/triggered');
//       dispatch({ type: ACTIONS.SET_TRIGGERED_ALERTS, payload: response.data });
//       console.log('Triggered alerts fetched successfully:', response.data);
//     } catch (error) {
//       console.error('Error fetching triggered alerts:', error);
//       dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch triggered alerts' });
//     }
//   }, [accessToken]);

//   // Create alert
//   const createAlert = useCallback(async (alertData) => {
//     try {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: true });
//       dispatch({ type: ACTIONS.CLEAR_ERROR });

//       const response = await axiosInstance.post('/api/Alerts', {
//         symbol: alertData.symbol,
//         targetPrice: alertData.targetPrice,
//         condition: alertData.condition
//       });

//       dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: response.data });
//       return { success: true, data: response.data };
//     } catch (error) {
//       console.error('Error creating alert:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to create alert';
//       dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
//       return { success: false, error: errorMessage };
//     } finally {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: false });
//     }
//   }, []);

//   // Delete alert
//   const deleteAlert = useCallback(async (alertId) => {
//     try {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: true });
//       dispatch({ type: ACTIONS.CLEAR_ERROR });

//       await axiosInstance.delete(`/api/Alerts/${alertId}`);
//       dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: alertId });
//       return { success: true };
//     } catch (error) {
//       console.error('Error deleting alert:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to delete alert';
//       dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
//       return { success: false, error: errorMessage };
//     } finally {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: false });
//     }
//   }, []);

//   const clearError = useCallback(() => {
//     dispatch({ type: ACTIONS.CLEAR_ERROR });
//   }, []);

//   // Main effect: Initialize data and SignalR when auth is ready and token is available
//   useEffect(() => {
//     const setup = async () => {
//       if (authReady && isAuthenticated && accessToken) {
//         console.log('Auth is ready and user is authenticated, initializing alerts...');

//         // Fetch data first
//         await fetchActiveAlerts();
//         await fetchTriggeredAlerts();

//         // Then initialize SignalR
//         await initializeSignalR();
//       } else if (authReady && !isAuthenticated) {
//         console.log('Auth is ready but user is not authenticated, clearing alerts...');
//         // Clear alerts if not authenticated
//         dispatch({ type: ACTIONS.SET_ACTIVE_ALERTS, payload: [] });
//         dispatch({ type: ACTIONS.SET_TRIGGERED_ALERTS, payload: [] });
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'disconnected' });
//       }
//     };

//     setup();

//     // Cleanup function
//     return () => {
//       if (connectionRef.current) {
//         connectionRef.current.stop();
//         connectionRef.current = null;
//       }
//     };
//   }, [authReady, isAuthenticated, accessToken, fetchActiveAlerts, fetchTriggeredAlerts, initializeSignalR]);

//   const value = {
//     activeAlerts: state.activeAlerts,
//     triggeredAlerts: state.triggeredAlerts,
//     loading: state.loading,
//     connectionStatus: state.connectionStatus,
//     error: state.error,

//     createAlert,
//     deleteAlert,
//     clearError,
//     refreshData: () => {
//       if (accessToken) {
//         fetchActiveAlerts();
//         fetchTriggeredAlerts();
//       }
//     }
//   };

//   return (
//     <AlertsContext.Provider value={value}>
//       {children}
//     </AlertsContext.Provider>
//   );
// };
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import * as signalR from "@microsoft/signalr";
import axiosInstance from "../Services/axios";
import { useAuth } from "./AuthContext"; // Import useAuth

// Action types
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ACTIVE_ALERTS: "SET_ACTIVE_ALERTS",
  SET_TRIGGERED_ALERTS: "SET_TRIGGERED_ALERTS",
  ADD_ACTIVE_ALERT: "ADD_ACTIVE_ALERT",
  REMOVE_ACTIVE_ALERT: "REMOVE_ACTIVE_ALERT",
  ADD_TRIGGERED_ALERT: "ADD_TRIGGERED_ALERT",
  SET_CONNECTION_STATUS: "SET_CONNECTION_STATUS",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Initial state
const initialState = {
  activeAlerts: [],
  triggeredAlerts: [],
  loading: false,
  connectionStatus: "disconnected", // 'connected', 'connecting', 'disconnected', 'failed'
  error: null,
};

// Reducer
const alertsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ACTIVE_ALERTS:
      return { ...state, activeAlerts: action.payload };
    case ACTIONS.SET_TRIGGERED_ALERTS:
      return { ...state, triggeredAlerts: action.payload };
    case ACTIONS.ADD_ACTIVE_ALERT:
      return {
        ...state,
        activeAlerts: [...state.activeAlerts, action.payload],
      };
    case ACTIONS.REMOVE_ACTIVE_ALERT: {
      console.log("Removing alert with ID:", action.payload);
      console.log("Current active alerts:", state.activeAlerts);

      const filteredAlerts = state.activeAlerts.filter((alert) => {
        // Use the correct ID property - check both id and alertId
        const alertId = alert.id || alert.alertId;
        const shouldRemove = alertId === action.payload;
        console.log(`Alert ${alertId} should be removed:`, shouldRemove);
        return !shouldRemove;
      });

      console.log("Filtered alerts:", filteredAlerts);

      return {
        ...state,
        activeAlerts: filteredAlerts,
      };
    }
    case ACTIONS.ADD_TRIGGERED_ALERT:
      return {
        ...state,
        triggeredAlerts: [action.payload, ...state.triggeredAlerts], // Add to beginning
      };
    case ACTIONS.SET_CONNECTION_STATUS:
      return { ...state, connectionStatus: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const AlertsContext = createContext();

// Custom hook
export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return context;
};

// Alerts Provider
export const AlertsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertsReducer, initialState);
  const connectionRef = React.useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get auth state from AuthContext
  const { accessToken, authReady, isAuthenticated } = useAuth();

  // Initialize SignalR connection
  const initializeSignalR = useCallback(async () => {
    if (!accessToken) {
      console.log("No access token available for SignalR connection");
      return;
    }

    try {
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: "connecting" });

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/alertsHub`, {
          accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

      // SignalR connection event handlers
      connection.onreconnecting(() => {
        dispatch({
          type: ACTIONS.SET_CONNECTION_STATUS,
          payload: "connecting",
        });
      });

      connection.onreconnected(() => {
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: "connected" });
      });

      connection.onclose(() => {
        dispatch({
          type: ACTIONS.SET_CONNECTION_STATUS,
          payload: "disconnected",
        });
      });

      // Real-time alert listeners - FIXED LOGIC
      connection.on("AlertTriggered", (triggeredAlert) => {
        console.log("SignalR: Alert triggered received", triggeredAlert);

        // Add to triggered alerts (added to beginning of array)
        dispatch({
          type: ACTIONS.ADD_TRIGGERED_ALERT,
          payload: triggeredAlert,
        });

        // Remove from active alerts using alertId (not id)
        const alertIdToRemove = triggeredAlert.alertId; // Your backend sends alertId
        console.log("Removing alert with alertId:", alertIdToRemove);
        dispatch({
          type: ACTIONS.REMOVE_ACTIVE_ALERT,
          payload: alertIdToRemove,
        });
      });

      connection.on("AlertCreated", (newAlert) => {
        console.log("SignalR: Alert created received", newAlert);
        dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: newAlert });
      });

      connection.on("AlertDeleted", (alertId) => {
        console.log("SignalR: Alert deleted received", alertId);
        dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: alertId });
      });

      await connection.start();
      connectionRef.current = connection;
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: "connected" });
      console.log("SignalR connection established successfully");
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: "failed" });
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to connect to real-time updates",
      });
    }
  }, [API_BASE_URL, accessToken]);

  // Retry SignalR connection if disconnected
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(() => {
      const connection = connectionRef.current;
      if (
        connection &&
        connection.state === signalR.HubConnectionState.Disconnected
      ) {
        console.log("🔁 Retrying SignalR connection...");
        connection.start().catch(console.error);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [accessToken]);

  // Fetch active alerts
  const fetchActiveAlerts = useCallback(async () => {
    if (!accessToken) {
      console.log("No access token available for fetching active alerts");
      return;
    }

    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await axiosInstance.get("/api/Alerts");
      dispatch({ type: ACTIONS.SET_ACTIVE_ALERTS, payload: response.data });
      console.log("Active alerts fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching active alerts:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to fetch active alerts",
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [accessToken]);

  // Fetch triggered alerts
  const fetchTriggeredAlerts = useCallback(async () => {
    if (!accessToken) {
      console.log("No access token available for fetching triggered alerts");
      return;
    }

    try {
      const response = await axiosInstance.get("/api/Alerts/triggered");
      dispatch({ type: ACTIONS.SET_TRIGGERED_ALERTS, payload: response.data });
      console.log("Triggered alerts fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching triggered alerts:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to fetch triggered alerts",
      });
    }
  }, [accessToken]);

  // Create alert
  const createAlert = useCallback(async (alertData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.CLEAR_ERROR });

      const response = await axiosInstance.post("/api/Alerts", {
        symbol: alertData.symbol,
        targetPrice: alertData.targetPrice,
        condition: alertData.condition,
      });

      dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error creating alert:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create alert";
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Delete alert
  const deleteAlert = useCallback(async (alertId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.CLEAR_ERROR });

      await axiosInstance.delete(`/api/Alerts/${alertId}`);
      dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: alertId });
      return { success: true };
    } catch (error) {
      console.error("Error deleting alert:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete alert";
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // Main effect: Initialize data and SignalR when auth is ready and token is available
  useEffect(() => {
    const setup = async () => {
      if (authReady && isAuthenticated && accessToken) {
        console.log(
          "Auth is ready and user is authenticated, initializing alerts..."
        );

        // Fetch data first
        await fetchActiveAlerts();
        await fetchTriggeredAlerts();

        // Then initialize SignalR
        await initializeSignalR();
      } else if (authReady && !isAuthenticated) {
        console.log(
          "Auth is ready but user is not authenticated, clearing alerts..."
        );
        // Clear alerts if not authenticated
        dispatch({ type: ACTIONS.SET_ACTIVE_ALERTS, payload: [] });
        dispatch({ type: ACTIONS.SET_TRIGGERED_ALERTS, payload: [] });
        dispatch({
          type: ACTIONS.SET_CONNECTION_STATUS,
          payload: "disconnected",
        });
      }
    };

    setup();

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [
    authReady,
    isAuthenticated,
    accessToken,
    fetchActiveAlerts,
    fetchTriggeredAlerts,
    initializeSignalR,
  ]);

  const value = {
    activeAlerts: state.activeAlerts,
    triggeredAlerts: state.triggeredAlerts,
    loading: state.loading,
    connectionStatus: state.connectionStatus,
    error: state.error,

    createAlert,
    deleteAlert,
    clearError,
    refreshData: () => {
      if (accessToken) {
        fetchActiveAlerts();
        fetchTriggeredAlerts();
      }
    },
  };

  return (
    <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>
  );
};
