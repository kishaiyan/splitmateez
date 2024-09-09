import { View, Text,  } from 'react-native'
import React from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import AppBar from '../../components/appBar'
import { SafeAreaView } from 'react-native-safe-area-context'

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
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar/>
    <View>

      <View className="mb-5">
       <Text className='text-secondary text-xl'>ACCOUNT DETAILS</Text>
      </View> 

      <View className='mb-6'>
      <Text className='text-white'>{user ? user : "No User is Signed in"}</Text>
      </View>
      <View className='items-center'>
        <Button title='Sign Out' containerStyle='px-10 py-3 bg-signOut border border-red-500' onPress={signOut}/>
      </View>
    </View>
   
    </SafeAreaView>
  )
}

export default Account