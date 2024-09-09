import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import Button from '../../components/customButton'
import { AntDesign } from '@expo/vector-icons'
import TextField from '../../components/textField'
import { handleResetPassword,handleCRP } from '../../lib/aws-amplify';
import { router } from 'expo-router'

const forgotPass = () => {
  const [email, setEmail] = useState("")
  const [codesent, setCodeSent] = useState(false);
  const [passform,setPassForm]=useState({
    password:"",
    code:"",
})
  
  

  const handleResetNextSteps = async ()=>{
    const response =await handleResetPassword({username:email})
    switch(response.nextStep.resetPasswordStep){

      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        console.log("Confirm_resetpaaword");
        setCodeSent(true);
        break;
      case 'DONE':
        console.log("Successfully reset password")
        break;
    }
    
  }

  const handleConfirmReset=async()=>{
    try {
      await handleCRP({
        username:email,
        confirmationCode:passform.code,
        newPassword:passform.password,
      })
      router.replace("/signIn")
    } catch (error) {
      
    }

  }
  return (
    <SafeAreaView className='bg-primary flex-1 px-5 items-center'>
      <AppBar />
      <View>
        <Text className='text-secondary text-xl mb-5'>Password Recovery</Text>
      </View>
      <Text className='text-white mb-6'>Please enter a valid email for password recovery</Text>
      <View className='flex-row mb-6 items-center'>
            <TextInput 
          className={`bg-fieldfill p-4 rounded-lg mr-2 ${codesent? "w-[80%]":" w-[90%]"} text-white` }
          placeholder='something@abcd.com'
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text)=>setEmail(text)}
          keyboardType={'email-address'}
          
          />
          {codesent && <AntDesign name='checkcircle' color="#009432" size={32}/>}
      </View>

     {!codesent && <Button title="Recover" containerStyle='px-10 py-2' onPress={handleResetNextSteps}></Button> }
     {codesent && 
     <View className='items-center'>
        <Text className='text-white mb-4'>
          The code has been sent to {email}
        </Text>
        <View className='flex-col items-center'>
          <TextField label="Code" value={passform.code} onhandleChange={(e) => setPassForm({ ...passform, code: e })} placeholder="secret code" keyboardtype="numeric" error=""/>
          <TextField label="Password" value={passform.password} onhandleChange={(e) => setPassForm({ ...passform, password: e })} placeholder="" keyboardtype="normal" error=""/>

          <Button title='Reset password' containerStyle='px-10 py-2 mt-2' onPress={handleConfirmReset}/>
        </View>
        </View>
        }
    </SafeAreaView>
  )
}

export default forgotPass