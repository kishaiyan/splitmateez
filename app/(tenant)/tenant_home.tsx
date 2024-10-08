import { Stack } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const tenant_home = () => {
  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <Stack.Screen />
    </SafeAreaView>
  )
}

export default tenant_home