import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'

const AddProperty = () => {
  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <AppBar/>
    </SafeAreaView>
  )
}

export default AddProperty