import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { getcurrentUser, handleSignOut, getAuthSession } from "../lib/aws-amplify";
import { getOwner, propertiesByOwnerID, tenantsByPropertyID, getTenant } from '../src/graphql/queries';
import client from "../lib/client";
import { getUrl } from 'aws-amplify/storage';
import { useWebSocket } from "./webSocketProvider";

const GlobalContext = createContext();

const initialOwnerState = {
  isLoggedIn: false,
  user: null,
  isLoading: true,
  properties: [],
  userDetails: {},
  userType: "owner",
  tenants: [],
  changePassword: false,
};

const initialTenantState = {
  isLoggedIn: false,
  user: null,
  isLoading: true,
  userDetails: null,
  userType: "tenant",
  changePassword: false,
};

const ownerReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_OUT':
      return { ...initialOwnerState, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoggedIn: !!action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SET_USER_DETAILS':
      return { ...state, userDetails: action.payload };
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
    case 'SET_CHANGE_PASSWORD':
      return { ...state, changePassword: action.payload };
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(property =>
          property.id === action.payload.id ? action.payload : property
        ),
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(property => property.id !== action.payload),
        tenants: state.tenants.filter(tenant => tenant.propertyID !== action.payload),
      };
    case 'SET_TENANTS':
      return { ...state, tenants: action.payload };
    case 'ADD_TENANT':
      return {
        ...state,
        tenants: [...state.tenants, action.payload],
        properties: state.properties.map(property =>
          property.id === action.payload.propertyID
            ? { ...property, tenants: [...(property.tenants || []), action.payload] }
            : property
        ),
      };
    case 'UPDATE_TENANT':
      return {
        ...state,
        tenants: state.tenants.map(tenant =>
          tenant.id === action.payload.id ? action.payload : tenant
        ),
        properties: state.properties.map(property => ({
          ...property,
          tenants: property.tenants?.map(tenant =>
            tenant.id === action.payload.id ? action.payload : tenant
          ) || [],
        })),
      };
    case 'DELETE_TENANT':
      return {
        ...state,
        tenants: state.tenants.filter(tenant => tenant.id !== action.payload.tenantId),
        properties: state.properties.map(property => ({
          ...property,
          tenants: property.tenants?.filter(tenant => tenant.id !== action.payload.tenantId) || [],
        })),
      };
    default:
      return state;
  }
};

const tenantReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_OUT':
      return { ...initialTenantState, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoggedIn: !!action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER_DETAILS':
      return { ...state, userDetails: action.payload };
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
    case 'SET_CHANGE_PASSWORD':
      return { ...state, changePassword: action.payload };
    default:
      return state;
  }
};

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const { connectWebSocket, disconnectWebSocket, setOnMessageHandler } = useWebSocket();
  const stateRef = useRef();
  const [state, dispatch] = useReducer((state, action) => {
    if (state.userType === "owner") {
      return ownerReducer(state, action);
    } else {
      return tenantReducer(state, action);
    }
  }, initialOwnerState);
  const isInitialized = useRef(false);
  const isWebSocketInitialized = useRef(false);

  const getImageURL = useCallback(async (url) => {
    if (!url) return null;
    try {
      const result = await getUrl({ path: url });
      return result.url.toString();
    } catch (error) {
      console.error("Error getting image URL:", error);
      return null;
    }
  }, []);

  const fetchUserDetails = useCallback(async (userId, userType) => {
    try {
      const session = await getAuthSession()
      let details;

      if (userType === "owner") {
        const { data } = await client.graphql({
          query: getOwner,
          variables: { id: userId },
        });
        details = data.getOwner;
      } else {
        const { data } = await client.graphql({
          query: getTenant,
          variables: { id: userId },

        });
        details = data.getTenant;
      }

      if (details) {
        details.photo = await getImageURL(details.photo);
      } else {
        console.warn(`No ${userType} details found for user ID: ${userId}`);
      }
      return details;
    } catch (error) {
      console.error("Error fetching user details:", {
        userId,
        userType,
        error: error,
        response: error.response ? error.response.data : null
      });
      return null;
    }
  }, [getImageURL]);

  const fetchTenants = useCallback(async (propertyId) => {
    if (!propertyId || state.userType !== "owner") return [];
    try {
      const { data: { tenantsByPropertyID: { items: tenants } } } = await client.graphql({
        query: tenantsByPropertyID,
        variables: { propertyID: propertyId }
      });
      return await Promise.all(tenants
        .filter(tenant => !tenant._deleted)
        .map(async tenant => ({
          ...tenant,
          photo: await getImageURL(tenant.photo)
        }))
      );
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  }, [getImageURL, state.userType]);

  const fetchProperties = useCallback(async (ownerId) => {
    if (!ownerId || state.userType !== "owner") return [];
    try {
      const { data: { propertiesByOwnerID: { items: properties } } } = await client.graphql({
        query: propertiesByOwnerID,
        variables: { ownerID: ownerId }
      });
      return await Promise.all(properties
        .filter(property => !property._deleted)
        .map(async property => {
          const photoUrl = await getImageURL(property.photo);
          return {
            ...property,
            photo: photoUrl,
            tenants: await fetchTenants(property.id)
          };
        })
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  }, [getImageURL, fetchTenants, state.userType]);
  function handleWebSocketMessage(message) {
    console.log("Received message:", message)
    try {
      const parsedMessage = JSON.parse(message);
      const { propertyId, tenant_cost } = parsedMessage.property_costs?.[0] || {};
      const { propertyId: propertyId2, tenant_cost: tenant_cost2 } = parsedMessage.property_costs?.[1] || {};

      // await client.graphql({
      //   query:getNotification
      // })
      const currentState = stateRef.current;

      // if (!propertyId || !tenant_cost) {
      //   console.warn("Unexpected message format:", parsedMessage);
      //   return;
      // }

      if (!Array.isArray(currentState.properties) || currentState.properties.length === 0) {
        console.warn("Properties array is empty or undefined. State:", currentState);
        return;
      }

      const property = currentState.properties.find(prop => prop.id === propertyId);

      if (property) {
        if (Array.isArray(tenant_cost)) {
          tenant_cost.forEach(({ id, value }) => {

            const tenant = property.tenants.find(t => t.id === id);
            if (tenant) {
              tenant.utilityCost = value;
            }
          });
        }
        dispatch({ type: 'UPDATE_PROPERTY', payload: property })
        console.log("Updated tenants utility cost:", property.tenants.map((tenant) => {
          return {
            id: tenant.id,
            utilityCost: tenant.utilityCost
          }
        }))
      } else {
        console.warn(`Property not found for ID: ${propertyId}. Available properties:`,
          currentState.properties.map(p => p.id));
      }
    } catch (error) {
      console.error("Error in handleWebSocketMessage:", error);
    }
  }

  const initializeWebSocket = useCallback(() => {
    if (isWebSocketInitialized.current) return;
    console.log("Initializing WebSocket");
    setOnMessageHandler(handleWebSocketMessage);
    connectWebSocket();
    isWebSocketInitialized.current = true;
  }, [connectWebSocket, setOnMessageHandler]);

  const initializeUserData = useCallback(async (user, userType) => {
    try {

      const details = await fetchUserDetails(user, userType);
      if (details) {
        dispatch({ type: 'SET_USER_DETAILS', payload: details });
        if (userType === "owner") {
          const properties = await fetchProperties(user);
          dispatch({ type: 'SET_PROPERTIES', payload: properties });
          dispatch({ type: 'SET_TENANTS', payload: properties.flatMap(property => property.tenants) });
          initializeWebSocket();
        }
      } else {
        console.error(`Failed to fetch user details for ${userType} with ID: ${user}`);
      }
    } catch (error) {
      console.error("Error fetching user details:", {
        userId,
        userType,
        error: error.message,
        response: error.response ? error.response.data : null
      });
    }
  }, [fetchUserDetails, fetchProperties, initializeWebSocket]);

  useEffect(() => {
    const initializeUser = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;
      try {
        const { userId, userType, changePassword } = await getcurrentUser();
        dispatch({ type: 'SET_USER', payload: userId });
        dispatch({ type: 'SET_USER_TYPE', payload: userType });
        dispatch({ type: 'SET_CHANGE_PASSWORD', payload: changePassword });
        if (userId) {
          await initializeUserData(userId, userType);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeUser();

    return disconnectWebSocket;
  }, [initializeUserData, disconnectWebSocket]);

  const updateStateAndProperties = useCallback(async () => {
    if (state?.user && state.userType === "owner") {
      const updatedProperties = await fetchProperties(state.user);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
      dispatch({ type: 'SET_TENANTS', payload: updatedProperties.flatMap(property => property.tenants) });
    }
  }, [state, fetchProperties]);

  const addProperty = useCallback(async (property) => {
    if (state.userType !== "owner") return;
    property.photo = await getImageURL(property.photo);
    dispatch({ type: 'ADD_PROPERTY', payload: property });
    await updateStateAndProperties();
  }, [getImageURL, updateStateAndProperties, state.userType]);

  const addTenant = useCallback(async (tenant) => {
    if (state.userType !== "owner") return;
    tenant.photo = await getImageURL(tenant.photo);
    dispatch({ type: 'ADD_TENANT', payload: tenant });
    await updateStateAndProperties();
  }, [getImageURL, updateStateAndProperties, state.userType]);

  const updateProperty = useCallback(async (property) => {
    if (state.userType !== "owner") return;
    dispatch({ type: 'UPDATE_PROPERTY', payload: property });
    await updateStateAndProperties();
  }, [updateStateAndProperties, state.userType]);

  const deleteProperty = useCallback(async (propertyId) => {
    if (state.userType !== "owner") return;
    dispatch({ type: 'DELETE_PROPERTY', payload: propertyId });
    await updateStateAndProperties();
  }, [updateStateAndProperties, state.userType]);

  const updateTenant = useCallback((tenant) => {
    if (state.userType !== "owner") return;
    dispatch({ type: 'UPDATE_TENANT', payload: tenant });
  }, [state.userType]);

  const deleteTenant = useCallback(async (tenantId) => {
    if (state.userType !== "owner") return;
    dispatch({ type: 'DELETE_TENANT', payload: { tenantId } });
    await updateStateAndProperties();
  }, [updateStateAndProperties, state.userType]);

  const addTenantToProperty = useCallback(async (propertyId, tenant) => {
    if (state.userType !== "owner") return;
    tenant.photo = await getImageURL(tenant.photo);
    dispatch({ type: 'ADD_TENANT', payload: tenant });
    await updateStateAndProperties();
  }, [getImageURL, updateStateAndProperties, state.userType]);

  const signOut = useCallback(async () => {
    try {
      await handleSignOut();
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const contextValue = {
    state,
    dispatch,
    ...(state.userType === "owner" ? {
      addProperty,
      updateProperty,
      deleteProperty,
      addTenant,
      updateTenant,
      deleteTenant,
      addTenantToProperty,
    } : {}),
    initializeUserData,
    signOut,
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
