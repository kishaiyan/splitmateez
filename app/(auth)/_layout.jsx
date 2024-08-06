import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Slot } from 'expo-router'

const AuthLayout = () => {
  return (
   <SafeAreaView className="bg-primary w-full h-full">
    <Slot />
   </SafeAreaView>
  )
}

export default AuthLayout