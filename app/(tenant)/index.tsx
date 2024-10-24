import AppBar from '../../components/appBar'
import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider'
import axios from 'axios'


const tenant_home = () => {
  const { state } = useGlobalContext()
  const { userDetails, user } = state
  console.log("userId", user)
  useEffect(() => {
    const getTenantUsage = async () => {
      try {
        const response = await axios.get(`https://akbv2v78o7.execute-api.ap-southeast-2.amazonaws.com/Production/tenant/${user}/costs`)
        const data = response.data
        console.log("tenant usage", data)
      } catch (error) {
        console.error("Error fetching tenant usage:", error)
      }
    }
    getTenantUsage()
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar leading={false} />
      <View>
        <Text className='text-white text-xl'>Welcome back</Text>
        <Text className='text-secondary text-2xl font-extrabold'>
          {userDetails.firstName} {userDetails.lastName}
        </Text>
        <View className='mt-4 items-center'>
          <Image
            source={{ uri: userDetails.photo }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
            resizeMode='contain'
          />
        </View>
        <View className='mt-6'>
          <Text className='text-white text-xl font-bold'>Utility Usage</Text>
          {userDetails.useElectricity && (
            <Text className='text-secondary mt-2'>Electricity: ${userDetails.electricityCost || '0'}</Text>
          )}
          {userDetails.useWater && (
            <Text className='text-secondary mt-2'>Water: ${userDetails.waterCost || '0'}</Text>
          )}
          {userDetails.useGas && (
            <Text className='text-secondary mt-2'>Gas: ${userDetails.gasCost || '0'}</Text>
          )}
          {userDetails.useInternet && (
            <Text className='text-secondary mt-2'>Internet: ${userDetails.internetCost || '0'}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default tenant_home