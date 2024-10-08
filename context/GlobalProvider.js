import { createContext, useContext, useReducer, useEffect } from "react";
import { getcurrentUser } from "../lib/aws-amplify";
import { getOwner, propertiesByOwnerID } from '../src/graphql/queries';
import client from "../lib/client";

const GlobalContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null,
  isLoading: true,
  properties: [],
  userDetails: null,
  userType:"Owner",
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
    default:
      return state;
  }
};

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
   // Function to fetch user details
   const getUserDetails = async (userId) => {
    try {
      const result = await client.graphql({
        query: getOwner,
        variables: { id: userId }
      });
      return result.data.getOwner; // Return the user details
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null; // Return null on error
    }
  };

  // Function to fetch properties based on owner ID
  const getProperty = async (ownerId) => {
    if (!ownerId) {
      console.log("Owner ID is not set, skipping properties fetch.");
      return [];
    }
    try {
      const result = await client.graphql({
        query: propertiesByOwnerID,
        variables: { ownerID: ownerId }
      });
      return result.data.propertiesByOwnerID.items; // Return the property items
    } catch (error) {
      console.error("Error getting properties:", error);
      return []; // Return empty array on error
    }
  };

  useEffect(() => {
    console.log("getting current user");
    getcurrentUser()
      .then(res => {
        dispatch({ type: 'SET_USER', payload: res });
      })
      .catch(error => {
        dispatch({ type: 'SET_USER', payload: null });
      })
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  }, []);

  // useEffect(async()=>{
  //   const properties = await getProperty(state.user);
  //   dispatch({ type: 'SET_PROPERTIES', payload: properties });
  // },[state.properties]);

  useEffect(() => {
    console.log("fetchUserDetails")
    const fetchUserDetails = async () => {
      if (state.user) {
        const details = await getUserDetails(state.user);
        dispatch({ type: 'SET_USER_DETAILS', payload: details });
  
        const properties = await getProperty(state.user);
        dispatch({ type: 'SET_PROPERTIES', payload: properties });
      }
    };
  
    fetchUserDetails();
  }, [state.user]); 

  

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
