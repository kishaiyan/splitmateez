import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'

const AddProperty = () => {
  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar/>
      <View>
        <Text className='text-secondary text-xl'>
            ADD PROPERTY
        </Text>
      </View>
      <View>
        
      </View>
    </SafeAreaView>
  )
}

export default AddProperty