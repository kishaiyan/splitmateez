import AppBar from '../../components/appBar'
import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider'

const tenant_home = () => {
  const { state } = useGlobalContext()
  const { userDetails } = state
  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar leading={false} />
      <View>
        <Text className='text-white text-xl'>Welcome back</Text>
        <Text className='text-secondary text-2xl font-extrabold'>
          {userDetails.firstName} {userDetails.lastName}
        </Text>
        <View className='mt-4'>
          <Image
            source={{ uri: userDetails.photo }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
            resizeMode='contain'
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default tenant_home