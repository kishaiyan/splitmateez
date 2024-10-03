import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const HomeTile = ({name,maximum,current,property}) => {
  const handlePress = () => {
    router.push(`/property?id=${property.id}`);
    // router.push(`/(home)/${property.id}`);
  };
  return (
    
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
    <View className='flex-col bg-tile p-4 h-[90%] w-[300px] rounded-3xl'>
      
    <View className='flex-row mb-1 h-[70%] items-center'>
      {/**? left side of the card */}
          <View className='w-[100%] rounded-lg'>
              <Image 
                source={{
                  uri:property.photo
                }}
                style={{width:'100%',height:300}}
                resizeMode='contain'
                />
          </View>
      {/**? right side of the card */}
          
      </View>
        <View className='flex-1 '>
          
          <View className='flex-row justify-around mb-5'>
            <View className='flex-col items-center'>
            <Text className='text-white'>
              Maximum
              </Text>
              <Text className='text-white'>
              {maximum}
              </Text>
            </View>
            <View className='flex-col items-center'>
            <Text className='text-white'>
              Current
              </Text>
              <Text className='text-white'>
              {current}
              </Text>
            </View>
          </View>
          <Text className='text-gray-200'>Address :</Text>
          <Text className='text-secondary'>{name}</Text>
        </View> 

    </View>
    </TouchableOpacity>
    
  )
}

export default HomeTile