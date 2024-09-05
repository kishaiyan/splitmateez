import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const HomeTile = ({name}) => {
  return (
    <TouchableOpacity onPress={()=>console.log("Clicked tile")}>
    <View className='flex-col bg-fieldfill m-1 p-4 h-[100%] w-[300px] rounded-3xl'>
    <View className='flex-row mb-1 h-[80%] items-center'>
      {/**? left side of the card */}
          <View className='w-[80%]'>
              <Image 
                source={require("../assets/images/splash.png")}
                className='w-[100%]'
                resizeMode='contain'
                />
          </View>
      {/**? right side of the card */}
          <View className='items-center h-[50%] justify-between '>
            
                <View className='p-5'>
                  <AntDesign name='upload' color={"#ffffff"} size={24}/>
                  <Text className='text-white text-center'>4</Text>
                </View>
                <View className='p-5'>
                  <AntDesign name='download' color={"#ffffff"} size={24}/>
                  <Text className='text-white text-center'>3</Text>
                </View>
          </View>
      </View>
        <View className='flex-1'>
          <Text className='text-gray-200'>Address :</Text>
          <Text className='text-secondary'>{name}</Text>
        </View> 

    </View>
    </TouchableOpacity>
  )
}

export default HomeTile