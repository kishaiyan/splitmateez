import { View, Text,Image, Pressable } from 'react-native'
import React from 'react'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'

const TenantCard = ({tenant,onPressElectricity,onPressGas,onPressWater,onPressWifi,onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <View className="p-2 bg-tile mb-2 rounded-lg">
        <Text className='text-white text-lg'>{tenant.fullName}</Text>
        <View className='flex-row justify-between'>
            <Image source={{uri:tenant.photo}} style={{
              width:'25%',
              height:100,
              resizeMode:"contain"
            }}/>

            <View className='items-center flex-1 justify-evenly flex-row'>
              <View className='items-center'>
                <Pressable onPress={onPressElectricity}>
                <Ionicons name='flash' size={35} color={tenant.electricity?"#BD6A33":"#424242"}/>
                </Pressable>
                <Text className='text-gray-100 font-light text-xs'>power</Text>
              </View>
              <View className='items-center'>
                <Pressable onPress={onPressWater}>
                <Ionicons name='water' size={35} color={tenant.waterAccess?"#BD6A33":"#424242"}/>
                </Pressable>
                <Text className='text-gray-100 font-light text-xs'>water</Text>
              </View>
              <View className='items-center'>
                <Pressable onPress={onPressWifi}>
                <Ionicons name='wifi' size={35} color={tenant.internet?"#BD6A33":"#424242"}/>
                </Pressable>
                <Text className='text-gray-100 font-light text-xs'>internet</Text>
              </View>
              <View className='items-center'>
                <Pressable onPress={onPressGas}>
                <FontAwesome5 name='fire' size={32} color={tenant.gas?"#BD6A33":"#424242"}/>
                </Pressable>
                <Text className='text-gray-100 font-light text-xs'>gas</Text>
              </View>
            </View>
        </View>
        
      </View>
    </Pressable>
  )
}

export default TenantCard