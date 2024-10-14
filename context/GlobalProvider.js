import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { getcurrentUser } from "../lib/aws-amplify";
import { getOwner, propertiesByOwnerID, tenantsByPropertyID } from '../src/graphql/queries';
import client from "../lib/client";
import { getUrl } from 'aws-amplify/storage';

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
            ? { ...property, tenants: [...property.tenants, action.payload] }
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
          tenants: property.tenants.map(tenant =>
            tenant.id === action.payload.id ? action.payload : tenant
          ),
        })),
      };
    case 'DELETE_TENANT':
      return {
        ...state,
        tenants: state.tenants.filter(tenant => tenant.id !== action.payload.tenantId),
        properties: state.properties.map(property => ({
          ...property,
          tenants: property.tenants.filter(tenant => tenant.id !== action.payload.tenantId)
        }))
      };
    case 'ADD_TENANT_TO_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(property =>
          property.id === action.payload.propertyId
            ? { ...property, tenants: [...(property.tenants || []), action.payload.tenant] }
            : property
        ),
      };
    default:
      return state;
  }
};

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getImageURL = useCallback(async (url) => {
    try {
      const result = await getUrl({ path: url });
      return result.url.toString();
    } catch (error) {
      console.log("Error getting image URL:", error);
      return null;
    }
  }, []);

  const fetchUserDetails = useCallback(async (userId) => {
    try {
      const result = await client.graphql({
        query: getOwner,
        variables: { id: userId }
      });
      const details = result.data.getOwner;
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
      const result = await client.graphql({
        query: tenantsByPropertyID,
        variables: { propertyID: propertyId }
      });
      const tenants = result.data.tenantsByPropertyID.items.filter(tenant => !tenant._deleted);
      return await Promise.all(tenants.map(async (tenant) => ({
        ...tenant,
        photo: await getImageURL(tenant.photo)
      })));
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  }, [getImageURL]);

  const fetchProperties = useCallback(async (ownerId) => {
    if (!ownerId) return [];
    try {
      const result = await client.graphql({
        query: propertiesByOwnerID,
        variables: { ownerID: ownerId }
      });

      const properties = result.data.propertiesByOwnerID.items.filter(property => !property._deleted);
      return await Promise.all(properties.map(async (property) => ({
        ...property,
        photo: await getImageURL(property.photo),
        tenants: await fetchTenants(property.id)
      })));
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  }, [getImageURL, fetchTenants]);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await getcurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
        if (user) {
          const details = await fetchUserDetails(user);
          dispatch({ type: 'SET_USER_DETAILS', payload: details });
          const properties = await fetchProperties(user);
          dispatch({ type: 'SET_PROPERTIES', payload: properties });
          const allTenants = properties.flatMap(property => property.tenants);
          dispatch({ type: 'SET_TENANTS', payload: allTenants });
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeUser();
  }, [fetchUserDetails, fetchProperties]);

  const addProperty = useCallback(async (property) => {
    property.photo = await getImageURL(property.photo);
    dispatch({ type: 'ADD_PROPERTY', payload: property });
    if (state.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  }, [state.user, fetchProperties, getImageURL]);

  const addTenant = useCallback(async (tenant) => {
    tenant.photo = await getImageURL(tenant.photo);
    dispatch({ type: 'ADD_TENANT', payload: tenant });
    if (state.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
      const allTenants = updatedProperties.flatMap(property => property.tenants);
      dispatch({ type: 'SET_TENANTS', payload: allTenants });
    }
  }, [state.user, fetchProperties, getImageURL]);

  const updateProperty = useCallback(async (property) => {
    dispatch({ type: 'UPDATE_PROPERTY', payload: property });
    if (state.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  }, [state.user, fetchProperties]);

  const deleteProperty = useCallback(async (propertyId) => {
    dispatch({ type: 'DELETE_PROPERTY', payload: propertyId });
    if (state.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  }, [state.user, fetchProperties]);



  const updateTenant = useCallback(async (tenant) => {
    dispatch({ type: 'UPDATE_TENANT', payload: tenant });
  }, []);

  const deleteTenant = useCallback(async (tenantId) => {
    dispatch({ type: 'DELETE_TENANT', payload: { tenantId } });
    if (state.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  }, [state.user, fetchProperties]);

  const addTenantToProperty = useCallback(async (propertyId, tenant) => {
    dispatch({ type: 'ADD_TENANT_TO_PROPERTY', payload: { propertyId, tenant } });
    dispatch({ type: 'ADD_TENANT', payload: tenant });
    if (state.user?.id) {
      const updatedProperties = await fetchProperties(state.user.id);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  }, [state.user, fetchProperties]);

  return (
    <GlobalContext.Provider value={{
      state,
      dispatch,
      addProperty,
      updateProperty,
      deleteProperty,
      addTenant,
      updateTenant,
      deleteTenant,
      addTenantToProperty
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
