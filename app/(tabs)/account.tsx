import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import AppBar from '../../components/appBar'

const Account = () => {
  const {user}=useGlobalContext()
  const signOut=()=>{
    try{
      handleSignOut()
      router.replace('/signIn')
    }
    catch(error){
      console.log(error)
    }
  
  }
  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <AppBar/>
    <View className='items-center justify-center bg-primary h-full'>
      <Text className='text-white'>Account</Text>
      <Text className='text-white'>{user}</Text>
      <Button title='Sign Out' containerStyle='px-10 py-3 bg-signOut border border-red-500' onPress={signOut}/>
    </View>
    </SafeAreaView>
  )
}

export default Account