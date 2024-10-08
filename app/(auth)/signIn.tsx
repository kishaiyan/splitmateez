import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Href, Link, useRouter } from 'expo-router';
import { handleSignIn} from '../../lib/aws-amplify';
import AppBar from '../../components/appBar';
import { useGlobalContext } from '../../context/GlobalProvider';
import Toast from "react-native-toast-message";
import LoadingScreen from '../../app/loadingScreen';



const signin = () => {
  const {isLoading,setIsLoading,setUser,userType}=useGlobalContext()
  const router=useRouter();
  const [signForm,setSignForm]=useState({
    email:'',
    password:''
  })
 
  const onsubmit=async()=>{
  try{ 
    setIsLoading(true)
     const {response,res,error}=await handleSignIn(
      {
        username:signForm.email,
        password:signForm.password,
      }
      )
   setIsLoading(false)
   if (response) {
    if (response.isSignedIn) {
        setUser(res.userId);
        // Redirect based on user type
        const redirectPath = userType === "Owner" ? '/home' : '/tenant_home';
        router.replace(redirectPath);
    } else if (response.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        router.push(`confirmEmail?email=${encodeURIComponent(signForm.email)}` as Href);
    }
} else {
    console.log(error);
    Alert.alert(
        "Wrong Credentials",
        "Please check your credentials; they do not match our records.",
        [
            {
                text: "Try again",
                onPress: () => {}
            },
            {
                text: "Sign Up",
                onPress: () => router.push('/signUp')
            }
        ]
    );
}

   
}
   catch(error){
    console.log(error) 
   }
  }
   const handleToast=()=>{
    console.log("Toast");
    
    Toast.show({
      type:"error",
      text1:"signed in",
      position:"top",
    })
   }

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      
      {/* // appBar */}
      <AppBar leading={false}/>
      {/* // Rest of the page */}
      {isLoading ?  <LoadingScreen /> : <View className='flex-1'>
          <View className='flex items-start'>
            <Text className="text-secondary text-xl">SIGN IN</Text>
          </View>
          <View className='items-center justify-start px-4 my-2'>
                <TextField label="Email" value={signForm.email} onhandleChange={(e)=>setSignForm({...signForm,email:e})}placeholder="john.doe@something.com" keyboardtype="email-address" error=""/>

                <TextField label="Password" value={signForm.password} onhandleChange={(e)=>setSignForm({...signForm,password:e})} keyboardtype="default" placeholder="Password" error=""/>

                <Button title='Sign In' containerStyle={`mt-5 mb-3 px-10 py-3 ${isLoading?'opacity-30':'opacity-100 '}` } isLoading={isLoading} onPress={onsubmit}/>
                <Link href={'/forgotPass'} className='text-gray-300 text-xs font-thin'>Forgot your password?</Link>
            </View>

            <View className='flex items-center mt-10'>
              <Text className='text-white text-md'>Don't have an account?</Text>
              <Link href={'/signUp'} className={`text-xl text-secondary`} disabled={isLoading}> Sign Up</Link>
        </View>
            
        </View>}  
        <Toast />
    </SafeAreaView>
    
  )
}

export default signin