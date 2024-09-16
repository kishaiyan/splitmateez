import { View, Text,Image  } from 'react-native'
import React, { useEffect } from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import AppBar from '../../components/appBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import AccountField from '../../components/accountField'


const Account = () => {
 
  const {userDetails,setUser,user}=useGlobalContext();
  
  console.log(userDetails.photo);
  const signOut=()=>{
    try{
      handleSignOut()
      setUser(null);
      console.log(user);
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
      <View className='items-center'>
      <Image source={{uri:"https://splitmate62a9bfe38a7f46bebb291853db82950142ddd-dev.s3.ap-southeast-2.amazonaws.com/public/c4eef3f0-5804-46d9-864c-39f2fd658ecb.jpeg"}} style={{width:100,height:100,marginBottom:16,borderRadius:50}} resizeMode='contain'/>
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
   
    </SafeAreaView>
  )
}

export default Account