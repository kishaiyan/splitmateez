import AppBar from '../../components/appBar'
import { View,Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const tenant_home = () => {
  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar leading={false}/>
      <View>
      <Text className='text-white text-xl'>Welcome back</Text>
          <Text className='text-secondary text-2xl font-extrabold'>
            First Last
          </Text>
      </View>
    </SafeAreaView>
  )
}

export default tenant_home