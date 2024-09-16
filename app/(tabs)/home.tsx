import { FlatList,View,Text, Pressable} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import HomeTile from '../../components/homeTile'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useGlobalContext } from '../../context/GlobalProvider'
import LoadingScreen from '../loadingScreen'
import { router } from 'expo-router'




const Home = () => {
  const ItemSeparator = () => (
    <View style={{ width: 10 }} /> // Adjust the width as needed
  );

  const {property}=useGlobalContext();
  const {userDetails}=useGlobalContext();
  const [notifyNumber,setNotifyNumber]=useState(10);
  const [visible, setVisible] = useState(true)
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setVisible(false);
    },2000);
  },[])
  
  return (
    <SafeAreaView className='flex-1 bg-primary  px-4'>
      <AppBar />
      {property && userDetails ? (
        <>
      <View className='h-[10%] flex-row justify-between'>
        
        <View>
          <Text className='text-white text-xl'>Welcome back</Text>
          
          <Text className='text-secondary text-2xl font-extrabold'>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
       </View>
       <Pressable onPress={()=>{router.push("/notifications"); setNotifyNumber(0)}}>
       <View className='items-end'>
          <View className={`${notifyNumber>0 ? "bg-red-400":"bg-transparent"} items-center rounded-xl ${notifyNumber>9 ? "w-5":"w-4"}`}>
            <Text className='text-white'>{notifyNumber>0 ? notifyNumber>9? "9+":notifyNumber:""  }</Text>
          </View>
          <Ionicons name='notifications' color={"#ffffff"} size={36}/>
       </View>
       </Pressable>
      </View>
      {visible? 
       <View className='flex-row items-center justify-center gap-2'>
        <MaterialIcons name='swipe' color='#ffffff' size={20}/>
        <Text className='text-gray-200'>Swipe for more properties</Text>
      </View>:
      <View>
      </View>}
      <View className='h-[65%] items-center'>

      <FlatList  
        ItemSeparatorComponent={ItemSeparator}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item)=>item.id}
        data={property}
        renderItem={({item})=>(
          
          <HomeTile 
          name={item.address} 
          maximum={item.maximum_tenant} 
          current={item.tenants.length}
          property={item}
          />
        
        )}
        horizontal
        
        
        />
        </View>
        </>): (<View className='flex-1 items-center justify-center'>
          <LoadingScreen />
          
        </View>)}
    </SafeAreaView>
  )
}

export default Home