import { FlatList,View,Text,Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import HomeTile from '../../components/homeTile'
import {  MaterialIcons } from '@expo/vector-icons'
import { useGlobalContext } from '../../context/GlobalProvider'


const Home = () => {
  const ItemSeparator = () => (
    <View style={{ width: 10 }} /> // Adjust the width as needed
  );

  const {property}=useGlobalContext();
  const {userDetails}=useGlobalContext();
  
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
      <View className='h-[10%]'>
        <Text className='text-white text-xl'>Welcome back</Text>
        
        <Text className='text-secondary text-2xl font-extrabold'>
          {userDetails.firstName} {userDetails.lastName}
        </Text>

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
          <Image
            style ={{width: "100%", height:"50%"}}
            source={require('../../assets/images/loading.gif')}
          />
        </View>)}
    </SafeAreaView>
  )
}

export default Home