import { createContext, useContext, useReducer, useEffect } from "react";
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

  const fetchUserDetails = async (userId) => {
    try {
      const result = await client.graphql({
        query: getOwner,
        variables: { id: userId }
      });
      return result.data.getOwner;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const fetchProperties = async (ownerId) => {
    if (!ownerId) {
      console.log("Owner ID is not set, skipping properties fetch.");
      return [];
    }
    try {
      const result = await client.graphql({
        query: propertiesByOwnerID,
        variables: { ownerID: ownerId }
      });
      const properties = result.data.propertiesByOwnerID.items;
  
      // Fetch tenants for each property
      const propertiesWithTenants = await Promise.all(properties.map(async (property) => {
        const tenants = await fetchTenants(property.id);
        // Ensure you are correctly spreading the property and adding tenants
        return { ...property, tenants };
      }));
     
      return propertiesWithTenants;
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  };
  
  const fetchTenants = async (propertyId) => {
    if (!propertyId) {
      console.log("Property ID is not set");
      return [];
    }
    try {
      const result = await client.graphql({
        query: tenantsByPropertyID,
        variables: { propertyID: propertyId }
      });
      const Tenants=result.data.tenantsByPropertyID.items;
      const tenantsWithImages = await Promise.all(Tenants.map(async (tenant) => {
        const imageUrl = await getImageURL(tenant.photo);
        return { ...tenant, photo: imageUrl }; // Return tenant with updated photo
      }));
      return tenantsWithImages; 
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  };  
  const getImageURL = async (url)=>{
    try {
      const result=await getUrl({
        path: url,
      })
    
      return result.url.toString();
      
    }catch(error){
      console.log("Error: ", error)
    }
  }
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await getcurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
        if (user) {
          const details = await fetchUserDetails(user);
          details.photo= await getImageURL(details.photo);
          dispatch({ type: 'SET_USER_DETAILS', payload: details });
          const properties = await fetchProperties(user);

          const updatedProperties = await Promise.all(properties.map(async (property) => {
            if (property.photo) {
              property.photo = await getImageURL(property.photo);
            }
            return property; // Return the updated property
          }));
          dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
        }
      } catch (error) {
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeUser();
  }, []);

  const addProperty = async(property) => {
    dispatch({ type: 'ADD_PROPERTY', payload: property });
    const ownerId = state.user?.id; // Assuming user has an 'id' field
    if (ownerId) {
      const updatedProperties = await fetchProperties(ownerId);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  };
  
  const addTenantToProperty = async(propertyId, tenant) => {
    dispatch({ type: 'ADD_TENANT_TO_PROPERTY', payload: { propertyId, tenant } });
    const ownerId = state.user?.id; // Get owner ID again
    if (ownerId) {
      const updatedProperties = await fetchProperties(ownerId);
      dispatch({ type: 'SET_PROPERTIES', payload: updatedProperties });
    }
  };
 
  return (
    <GlobalContext.Provider value={{ state,dispatch, addProperty, addTenantToProperty }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
