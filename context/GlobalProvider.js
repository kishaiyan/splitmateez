
import { getcurrentUser } from "../lib/aws-amplify";
import { createContext,useContext,useState,useEffect } from "react";
import { generateClient } from 'aws-amplify/api'
import { getOwner } from '../src/graphql/queries'


const GlobalContext= createContext();
export const useGlobalContext=()=>useContext(GlobalContext);

const GlobalProvider = ({children})=>{
 
  const [property,setProperty]=useState([
    {
      id: "1",
      address: "123 Elm Street",
      photo:"https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rooms: 3,
      bathroom: 2,
      parking_space: 1,
      maximum_tenant: 4,
      tenants: [
        {
          id: "1",
          fullName: "John Doe",
          email: "john@example.com",
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpd4mJRIUwqgE8D_Z2znANEbtiz4GhI4M8NQ&s",
          room_number: 1,
          address: "123 Elm Street",
          waterAccess: true,
          electricity: true,
          internet: true,
          gas: false,
        },
        {
          id: "2",
          fullName: "Jane Doe",
          email: "jane@example.com",
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpd4mJRIUwqgE8D_Z2znANEbtiz4GhI4M8NQ&s",
          room_number: 1,
          address: "456 Maple Avenue",
          waterAccess: true,
          electricity: true,
          internet: true,
          gas: true,
        },{
          id: "3",
          fullName: "Jane Doe",
          email: "jane@example.com",
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpd4mJRIUwqgE8D_Z2znANEbtiz4GhI4M8NQ&s",
          room_number: 1,
          address: "456 Maple Avenue",
          waterAccess: true,
          electricity: true,
          internet: true,
          gas: true,
        },
        // Add more tenants if needed
      ],
    },
    {
      id: "2",
      address: "456 Maple Avenue",
      photo:"https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rooms: 2,
      bathroom: 1,
      parking_space: 1,
      maximum_tenant: 3,
      tenants: [
        // {
        //   id: "2",
        //   fullName: "Jane Doe",
        //   email: "jane@example.com",
        //   photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpd4mJRIUwqgE8D_Z2znANEbtiz4GhI4M8NQ&s",
        //   room_number: 1,
        //   address: "456 Maple Avenue",
        //   waterAccess: true,
        //   electricity: true,
        //   internet: true,
        //   gas: true,
        // },
        // Add more tenants if needed
      ],
    },
  ])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user,setUser]=useState(null)
  const [isLoading,setIsLoading]=useState(true)
  const client=generateClient();
  const [userDetails, setuserDetails] = useState(null)
  const userType="Owner"

  const getUserDetails=async()=>{
    try{
    const result=await client.graphql({query:getOwner, variables:{
      id:user
    }})
    return result.data.getOwner;
  }
    catch(error){
      console.log("User Details Error",error);
    }
  }
  useEffect(()=>{
    const fetchUserDetails=async()=>{
      if(user){
        const details=await getUserDetails(user);
        setuserDetails(details);
        ;}
  }
   fetchUserDetails();
  },[user])
  useEffect(()=>{
    getcurrentUser()
    .then((res)=>{
      if(res)
        {
          setUser(res)
          setIsLoggedIn(true)
        }
        else{
          setUser(null)
          setIsLoggedIn(false)
        }
    })
    .catch((error)=>{console.log(error)})
    .finally(()=>setIsLoading(false))
    
  },[])

  return(
    <GlobalContext.Provider
    value={{
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      isLoading,
      setIsLoading,
      property,
      setProperty,
      userDetails,
      userType,
    }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider