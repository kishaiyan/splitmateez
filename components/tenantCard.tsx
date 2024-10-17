import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'

const TenantCard = ({ tenant, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className="p-2 bg-tile mb-2 rounded-lg">
        <Text className='text-white text-lg'>{tenant.firstName}</Text>
        <View className='flex-row justify-between'>
          <Image source={{ uri: tenant.photo }} style={{
            width: '25%',
            height: 100,
            borderRadius: 20,
            resizeMode: "contain"
          }} />

          <View className='items-center flex-1 justify-evenly flex-row'>
            <View className='items-center'>

              <Ionicons name='flash' size={35} color={tenant.useElectricity ? "#E3EA2F" : "#424242"} />

              <Text className='text-gray-100 font-light text-xs'>power</Text>
            </View>
            <View className='items-center'>

              <Ionicons name='water' size={35} color={tenant.useWater ? "#2FD5EA" : "#424242"} />

              <Text className='text-gray-100 font-light text-xs'>water</Text>
            </View>
            <View className='items-center'>

              <Ionicons name='wifi' size={35} color={tenant.useInternet ? "#5371FF" : "#424242"} />

              <Text className='text-gray-100 font-light text-xs'>internet</Text>
            </View>
            <View className='items-center'>

              <FontAwesome5 name='fire' size={32} color={tenant.useGas ? "#ECA314" : "#424242"} />

              <Text className='text-gray-100 font-light text-xs'>gas</Text>
            </View>
          </View>
        </View>

      </View>
    </Pressable>
  )
}

export default TenantCard