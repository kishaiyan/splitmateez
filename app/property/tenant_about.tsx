import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const TenantAbout = () => {

  const {id}=useLocalSearchParams()
  return (
    <View>
      <Text>TenantAbout{id}</Text>
    </View>
  )
}

export default TenantAbout