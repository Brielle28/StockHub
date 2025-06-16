// // AlertsContext.js
// import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
// import * as signalR from '@microsoft/signalr';
// import axiosInstance from '../Services/axios';

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
//       return { 
//         ...state, 
//         activeAlerts: [...state.activeAlerts, action.payload] 
//       };
    
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

// // Custom hook to use the alerts context
// export const useAlerts = () => {
//   const context = useContext(AlertsContext);
//   if (!context) {
//     throw new Error('useAlerts must be used within an AlertsProvider');
//   }
//   return context;
// };

// // Alerts Provider Component
// export const AlertsProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(alertsReducer, initialState);
//   const connectionRef = React.useRef(null);

//   // API Base URL
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   // Initialize SignalR connection
//   const initializeSignalR = useCallback(async () => {
//     try {
//       dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connecting' });

//       const connection = new signalR.HubConnectionBuilder()
//         .withUrl(`${API_BASE_URL}/alertsHub`, {
//           accessTokenFactory: () => localStorage.getItem('accessToken')
//         })
//         .withAutomaticReconnect()
//         .build();

//       // Handle connection events
//       connection.onreconnecting(() => {
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connecting' });
//       });

//       connection.onreconnected(() => {
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connected' });
//       });

//       connection.onclose(() => {
//         dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'disconnected' });
//       });

//       // Listen for alert triggers
//       connection.on('AlertTriggered', (triggeredAlert) => {
//         dispatch({ type: ACTIONS.ADD_TRIGGERED_ALERT, payload: triggeredAlert });
//         // Remove from active alerts if it exists
//         dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: triggeredAlert.id });
//       });

//       // Listen for new alerts from other sessions
//       connection.on('AlertCreated', (newAlert) => {
//         dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: newAlert });
//       });

//       // Listen for deleted alerts from other sessions
//       connection.on('AlertDeleted', (alertId) => {
//         dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: alertId });
//       });

//       await connection.start();
//       connectionRef.current = connection;
//       dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connected' });
      
//     } catch (error) {
//       console.error('SignalR Connection Error:', error);
//       dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'failed' });
//       dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to connect to real-time updates' });
//     }
//   }, [API_BASE_URL]);

//   // Fetch active alerts
//   const fetchActiveAlerts = useCallback(async () => {
//     try {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: true });
//       const response = await axiosInstance.get('/api/Alerts');
//       dispatch({ type: ACTIONS.SET_ACTIVE_ALERTS, payload: response.data });
//     } catch (error) {
//       console.error('Error fetching active alerts:', error);
//       dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch active alerts' });
//     } finally {
//       dispatch({ type: ACTIONS.SET_LOADING, payload: false });
//     }
//   }, []);

//   // Fetch triggered alerts
//   const fetchTriggeredAlerts = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get('/api/Alerts/triggered');
//       dispatch({ type: ACTIONS.SET_TRIGGERED_ALERTS, payload: response.data });
//     } catch (error) {
//       console.error('Error fetching triggered alerts:', error);
//       dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch triggered alerts' });
//     }
//   }, []);

//   // Create new alert
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

//   // Clear error
//   const clearError = useCallback(() => {
//     dispatch({ type: ACTIONS.CLEAR_ERROR });
//   }, []);

//   // Initialize data and SignalR connection
//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       fetchActiveAlerts();
//       fetchTriggeredAlerts();
//       initializeSignalR();
//     }

//     // Cleanup function
//     return () => {
//       if (connectionRef.current) {
//         connectionRef.current.stop();
//       }
//     };
//   }, [fetchActiveAlerts, fetchTriggeredAlerts, initializeSignalR]);

//   // Context value
//   const value = {
//     // State
//     activeAlerts: state.activeAlerts,
//     triggeredAlerts: state.triggeredAlerts,
//     loading: state.loading,
//     connectionStatus: state.connectionStatus,
//     error: state.error,
    
//     // Actions
//     createAlert,
//     deleteAlert,
//     clearError,
//     refreshData: () => {
//       fetchActiveAlerts();
//       fetchTriggeredAlerts();
//     }
//   };

//   return (
//     <AlertsContext.Provider value={value}>
//       {children}
//     </AlertsContext.Provider>
//   );
// };
// AlertsContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import axiosInstance from '../Services/axios';

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ACTIVE_ALERTS: 'SET_ACTIVE_ALERTS',
  SET_TRIGGERED_ALERTS: 'SET_TRIGGERED_ALERTS',
  ADD_ACTIVE_ALERT: 'ADD_ACTIVE_ALERT',
  REMOVE_ACTIVE_ALERT: 'REMOVE_ACTIVE_ALERT',
  ADD_TRIGGERED_ALERT: 'ADD_TRIGGERED_ALERT',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  activeAlerts: [],
  triggeredAlerts: [],
  loading: false,
  connectionStatus: 'disconnected', // 'connected', 'connecting', 'disconnected', 'failed'
  error: null
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
        activeAlerts: [...state.activeAlerts, action.payload] 
      };
    
    case ACTIONS.REMOVE_ACTIVE_ALERT:
      return { 
        ...state, 
        activeAlerts: state.activeAlerts.filter(alert => alert.id !== action.payload) 
      };
    
    case ACTIONS.ADD_TRIGGERED_ALERT:
      return { 
        ...state, 
        triggeredAlerts: [action.payload, ...state.triggeredAlerts] 
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

// Custom hook to use the alerts context
export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};

// Helper function to normalize alert data
const normalizeTriggeredAlert = (alert) => {
  console.log('Raw triggered alert from SignalR:', alert);
  
  return {
    ...alert,
    // Ensure condition is numeric
    condition: typeof alert.condition === 'string' ? 
      (alert.condition === 'Greater Than' ? 0 : 
       alert.condition === 'Less Than' ? 1 : 
       alert.condition === 'Equals' ? 2 : alert.condition) : 
      alert.condition,
    // Normalize date fields
    triggerDate: alert.triggerDate || alert.triggeredAt || alert.createdAt,
    triggeredAt: alert.triggeredAt || alert.triggerDate || alert.createdAt
  };
};

// Alerts Provider Component
export const AlertsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertsReducer, initialState);
  const connectionRef = React.useRef(null);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize SignalR connection
  const initializeSignalR = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connecting' });

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/alertsHub`, {
          accessTokenFactory: () => localStorage.getItem('accessToken')
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information) // Add logging for debugging
        .build();

      // Handle connection events
      connection.onreconnecting(() => {
        console.log('SignalR: Reconnecting...');
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connecting' });
      });

      connection.onreconnected(() => {
        console.log('SignalR: Reconnected');
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connected' });
      });

      connection.onclose((error) => {
        console.log('SignalR: Connection closed', error);
        dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'disconnected' });
      });

      // Listen for alert triggers - FIXED
      connection.on('AlertTriggered', (triggeredAlert) => {
        console.log('SignalR: Alert triggered received:', triggeredAlert);
        
        try {
          const normalizedAlert = normalizeTriggeredAlert(triggeredAlert);
          console.log('Normalized triggered alert:', normalizedAlert);
          
          dispatch({ type: ACTIONS.ADD_TRIGGERED_ALERT, payload: normalizedAlert });
          // Remove from active alerts if it exists
          dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: normalizedAlert.id });
          
          console.log('Alert moved from active to triggered successfully');
        } catch (error) {
          console.error('Error processing triggered alert:', error);
        }
      });

      // Listen for new alerts from other sessions
      connection.on('AlertCreated', (newAlert) => {
        console.log('SignalR: New alert created:', newAlert);
        dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: newAlert });
      });

      // Listen for deleted alerts from other sessions
      connection.on('AlertDeleted', (alertId) => {
        console.log('SignalR: Alert deleted:', alertId);
        dispatch({ type: ACTIONS.REMOVE_ACTIVE_ALERT, payload: alertId });
      });

      await connection.start();
      connectionRef.current = connection;
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'connected' });
      console.log('SignalR: Connected successfully');
      
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: 'failed' });
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to connect to real-time updates' });
    }
  }, [API_BASE_URL]);

  // Fetch active alerts
  const fetchActiveAlerts = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await axiosInstance.get('/api/Alerts');
      dispatch({ type: ACTIONS.SET_ACTIVE_ALERTS, payload: response.data });
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch active alerts' });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Fetch triggered alerts
  const fetchTriggeredAlerts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/Alerts/triggered');
      dispatch({ type: ACTIONS.SET_TRIGGERED_ALERTS, payload: response.data });
    } catch (error) {
      console.error('Error fetching triggered alerts:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch triggered alerts' });
    }
  }, []);

  // Create new alert
  const createAlert = useCallback(async (alertData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.CLEAR_ERROR });
      
      const response = await axiosInstance.post('/api/Alerts', {
        symbol: alertData.symbol,
        targetPrice: alertData.targetPrice,
        condition: alertData.condition
      });
      
      dispatch({ type: ACTIONS.ADD_ACTIVE_ALERT, payload: response.data });
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error('Error creating alert:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create alert';
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
      console.error('Error deleting alert:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete alert';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // Initialize data and SignalR connection
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchActiveAlerts();
      fetchTriggeredAlerts();
      initializeSignalR();
    }

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [fetchActiveAlerts, fetchTriggeredAlerts, initializeSignalR]);

  // Context value
  const value = {
    // State
    activeAlerts: state.activeAlerts,
    triggeredAlerts: state.triggeredAlerts,
    loading: state.loading,
    connectionStatus: state.connectionStatus,
    error: state.error,
    
    // Actions
    createAlert,
    deleteAlert,
    clearError,
    refreshData: () => {
      fetchActiveAlerts();
      fetchTriggeredAlerts();
    }
  };

  return (
    <AlertsContext.Provider value={value}>
      {children}
    </AlertsContext.Provider>
  );
};