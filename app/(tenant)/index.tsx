import AppBar from '../../components/appBar'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider'
import axios from 'axios'
import LottieView from 'lottie-react-native';

const tenant_home = () => {
  const { state } = useGlobalContext()
  const { userDetails, user } = state
  const [utilityUsage, setUtilityUsage] = useState({
    electricity: '0',
    gas: '0',
  });

  useEffect(() => {
    const getTenantUsage = async () => {
      try {
        console.log(user);
        const response = await axios.get(`https://akbv2v78o7.execute-api.ap-southeast-2.amazonaws.com/Production/tenant/${user}/costs`)
        const data = response.data.costs
        data.forEach((activity) => {
          if (activity.Activity === 'Light') {
            setUtilityUsage(prevState => ({
              ...prevState,
              electricity: activity.Cost.toFixed(2)
            }));
          } else if (activity.Activity === 'Gas') {
            setUtilityUsage(prevState => ({
              ...prevState,
              gas: activity.Cost.toFixed(2)
            }));
          }
        })
      } catch (error) {

      }
    }

    getTenantUsage() // Initial call

    const intervalId = setInterval(() => {
      getTenantUsage() // Call every 5 minutes
    }, 5 * 60 * 1000) // 5 minutes in milliseconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [user]) // Added user to the dependency array

  return (
    <SafeAreaView className='flex-1 bg-primary px-2'>
      <AppBar leading={false} />
      <View className='flex-1'>
        <View className='flex flex-row items-center justify-between px-4 py-4'>
          <View className='flex flex-col'>
            <Text className='text-white text-xl'>Welcome back</Text>
            <Text className='text-secondary text-2xl font-extrabold'>
              {userDetails.firstName} {userDetails.lastName}
            </Text>
          </View>

        </View>
        <View className='px-4'>


          <View className='mt-6'>
            <Text className='text-white text-lg font-semibold mb-3'>Utility Usage</Text>
            <View className='flex flex-col space-y-3 mt-2'>
              <View className='flex flex-row items-center bg-tile px-3 py-2 rounded-lg'>
                <LottieView
                  source={require('../../assets/images/electricity.json')}
                  autoPlay
                  loop
                  style={{ width: 50, height: 50 }} />
                <View className='w-[10%]'></View>
                <Text className="text-zinc-200 ml-2 font-semibold text-lg">
                  Electricity: <Text className="text-orange-500 font-light">$ {utilityUsage.electricity}</Text>
                </Text>
              </View>
              <View className='flex flex-row items-center mt-2 bg-tile px-3 py-2 rounded-lg'>
                <LottieView source={require('../../assets/images/gas.json')} autoPlay loop style={{ width: 50, height: 50 }} />
                <View className='w-[10%]'></View>

                <Text className="text-zinc-200 ml-2 font-semibold text-lg">
                  Gas: <Text className="text-orange-500 font-light">$ {utilityUsage.gas}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default tenant_home