
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

export default function notification() {
  return (
    <SafeAreaView className='flex-1 bg-primary'>

<Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle:"Home",
          headerTitle: "Notifications",
          headerTintColor: "#ffffff",
          headerTitleAlign:'center',
          headerStyle: {
            backgroundColor: "#424242",
          },
        }}
      />
    </SafeAreaView>
  )
}