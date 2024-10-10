import { View, Text,Image,KeyboardAvoidingView  } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import AppBar from '../../components/appBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import AccountField from '../../components/accountField'
import { getUrl } from 'aws-amplify/storage';

// Function to get pre-signed URL for the image


const Account = () => {
  const { state, dispatch } = useGlobalContext();
  const { userDetails } = state;

  const signOut=()=>{
    try{
      handleSignOut()
      dispatch
      router.replace('/signIn')
    }
    catch(error){
      console.log(error)
    }
  }
  
  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <KeyboardAvoidingView
      behavior='padding'>
        <AppBar leading={false}/>
    <View>
      <View className="mb-5">
       <Text className='text-secondary text-xl'>ACCOUNT DETAILS</Text>
      </View> 
      <View className='mb-6'>
      <View className='items-center'>
      <Image 
      source={{ uri: userDetails.photo }}
      style={{width:100,height:100,marginBottom:16,borderRadius:50}} 
      resizeMode='contain'
      onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}/>
      </View>
          <AccountField name="Email" text={userDetails.email}/>
          <AccountField name="Phone" text={userDetails.phNo}/>
          <AccountField name="Given" text={userDetails.firstName}/>
          <AccountField name="last" text={userDetails.lastName}/>
      </View>
      <View className='items-center'>
        <Button title='Sign Out' containerStyle='px-10 py-3 bg-signOut border border-red-500' onPress={signOut}/>
      </View>
    </View>
    </KeyboardAvoidingView>
      
    </SafeAreaView>
  )
}

export default Account