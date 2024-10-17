import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { getcurrentUser } from "../lib/aws-amplify";
import { getOwner, propertiesByOwnerID, tenantsByPropertyID } from '../src/graphql/queries';
import client from "../lib/client";
import { getUrl } from 'aws-amplify/storage';
import { useWebSocket } from "./webSocketProvider";

const GlobalContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoading: true,
  properties: [],
  userDetails: null,
  userType: "Owner",
  tenants: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_OUT':
      return { ...initialState, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoggedIn: !!action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SET_USER_DETAILS':
      return { ...state, userDetails: action.payload };
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

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const { connectWebSocket, disconnectWebSocket, setOnMessageHandler } = useWebSocket();
  const [state, dispatch] = useReducer(reducer, initialState);
  const isInitialized = useRef(false);

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

  const fetchUserDetails = useCallback(async (userId) => {
    try {
      const { data: { getOwner: details } } = await client.graphql({
        query: getOwner,
        variables: { id: userId }
      });
      details.photo = await getImageURL(details.photo);
      return details;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }, [getImageURL]);

  const fetchTenants = useCallback(async (propertyId) => {
    if (!propertyId) return [];
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
  }, [getImageURL]);

  const fetchProperties = useCallback(async (ownerId) => {
    if (!ownerId) return [];
    try {
      const { data: { propertiesByOwnerID: { items: properties } } } = await client.graphql({
        query: propertiesByOwnerID,
        variables: { ownerID: ownerId }
      });
      return await Promise.all(properties
        .filter(property => !property._deleted)
        .map(async property => ({
          ...property,
          photo: await getImageURL(property.photo),
          tenants: await fetchTenants(property.id)
        }))
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  }, [getImageURL, fetchTenants]);

  const handleWebSocketMessage = useCallback((message) => {
    console.log('Received WebSocket message:', message);
    // Add your message handling logic here
    // For example:
    // if (message.type === 'PROPERTY_UPDATE') {
    //   updateProperty(message.data);
    // } else if (message.type === 'TENANT_UPDATE') {
    //   updateTenant(message.data);
    // }
  }, [/* Add dependencies based on what you use in the handler */]);

  const initializeWebSocket = useCallback(() => {
    connectWebSocket();
    setOnMessageHandler(handleWebSocketMessage);
  }, [connectWebSocket, setOnMessageHandler, handleWebSocketMessage]);

  const initializeUserData = useCallback(async (user) => {
    try {
      console.log("Trying to initialize user data", user)
      const [details, properties] = await Promise.all([
        fetchUserDetails(user),
        fetchProperties(user)
      ]);
      dispatch({ type: 'SET_USER_DETAILS', payload: details });
      dispatch({ type: 'SET_PROPERTIES', payload: properties });
      dispatch({ type: 'SET_TENANTS', payload: properties.flatMap(property => property.tenants) });
      initializeWebSocket();
    } catch (error) {
      console.error("Error initializing user data:", error);
    }
  }, [fetchUserDetails, fetchProperties, initializeWebSocket, dispatch]);

  useEffect(() => {
    const initializeUser = async () => {
      if (isInitialized.current) return
      isInitialized.current = true
      try {
        const user = await getcurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
        if (user) {
          await initializeUserData(user);
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
    if (state?.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
      dispatch({ type: 'SET_TENANTS', payload: updatedProperties.flatMap(property => property.tenants) });
    }
  }, [state, fetchProperties]);

  const addProperty = useCallback(async (property) => {
    property.photo = await getImageURL(property.photo);
    dispatch({ type: 'ADD_PROPERTY', payload: property });
    await updateStateAndProperties();
  }, [getImageURL, updateStateAndProperties]);

  const addTenant = useCallback(async (tenant) => {
    tenant.photo = await getImageURL(tenant.photo);
    dispatch({ type: 'ADD_TENANT', payload: tenant });
    await updateStateAndProperties();
  }, [getImageURL, updateStateAndProperties]);

  const updateProperty = useCallback(async (property) => {
    dispatch({ type: 'UPDATE_PROPERTY', payload: property });
    await updateStateAndProperties();
  }, [updateStateAndProperties]);

  const deleteProperty = useCallback(async (propertyId) => {
    dispatch({ type: 'DELETE_PROPERTY', payload: propertyId });
    await updateStateAndProperties();
  }, [updateStateAndProperties]);

  const updateTenant = useCallback((tenant) => {
    dispatch({ type: 'UPDATE_TENANT', payload: tenant });
  }, []);

  const deleteTenant = useCallback(async (tenantId) => {
    dispatch({ type: 'DELETE_TENANT', payload: { tenantId } });
    await updateStateAndProperties();
  }, [updateStateAndProperties]);

  const addTenantToProperty = useCallback(async (propertyId, tenant) => {
    tenant.photo = await getImageURL(tenant.photo);
    dispatch({ type: 'ADD_TENANT', payload: tenant });
    await updateStateAndProperties();
  }, [getImageURL, updateStateAndProperties]);

  const contextValue = {
    state,
    dispatch,
    addProperty,
    updateProperty,
    deleteProperty,
    addTenant,
    updateTenant,
    deleteTenant,
    addTenantToProperty,
    initializeUserData,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
