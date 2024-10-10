import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Href, Link, useRouter } from 'expo-router';
import { handleSignIn } from '../../lib/aws-amplify';
import AppBar from '../../components/appBar';
import { useGlobalContext } from '../../context/GlobalProvider';
import Toast from "react-native-toast-message";
import LoadingScreen from '../../app/loadingScreen';

const Signin = () => {
  const { state, dispatch } = useGlobalContext();
  if(!dispatch){
    console.error("Dispatch not imported rightly")
  }
  const { isLoading, userType } = state;
  const router = useRouter();
  const [signForm, setSignForm] = useState({
    email: '',
    password: ''
  });

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "top",
    });
  };

  const handleSignInSubmit = async () => {
    try {
      const { response, res, error } = await handleSignIn({
        username: signForm.email,
        password: signForm.password,
      });
      console.info(response);
      if (response) {
        dispatch({ type: 'SET_USER', payload: res.userId });
        handleSignInResponse(response, res);
      } else {
        handleSignInError(error);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      showErrorToast(error);
    } 
    
  };

  const handleSignInResponse = (response, res) => {
  
    if (response.isSignedIn) {
      dispatch({ type: 'SET_USER', payload: res.userId });
      const redirectPath = userType === "Owner" ? '/(home)' : '/(tenant)';
      router.replace(redirectPath);
    } else if (response.nextStep.signInStep === "CONFIRM_SIGN_UP") {
      router.push(`confirmEmail?email=${encodeURIComponent(signForm.email)}` as Href);
    }
  };

  const handleSignInError = (error) => {
    console.error(error);
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
  };

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      <AppBar leading={false} />
      {isLoading ? <LoadingScreen /> : (
        <View className='flex-1'>
          <View className='flex items-start'>
            <Text className="text-secondary text-xl">SIGN IN</Text>
          </View>
          <View className='items-center justify-start px-4 my-2'>
            <TextField
              label="Email"
              value={signForm.email}
              onhandleChange={(email) => setSignForm({ ...signForm, email })}
              placeholder="john.doe@something.com"
              keyboardtype="email-address"
              error=""
            />

            <TextField
              label="Password"
              value={signForm.password}
              onhandleChange={(password) => setSignForm({ ...signForm, password })}
              keyboardtype="default"
              placeholder="Password"
              error=""
            />

            <Button
              title='Sign In'
              containerStyle={`mt-5 mb-3 px-10 py-3 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
              isLoading={isLoading}
              onPress={handleSignInSubmit}
            />
            <Link href={'/forgotPass'} className='text-gray-300 text-xs font-thin'>Forgot your password?</Link>
          </View>

          <View className='flex items-center mt-10'>
            <Text className='text-white text-md'>Don't have an account?</Text>
            <Link href={'/signUp'} className={`text-xl text-secondary`} disabled={isLoading}> Sign Up</Link>
          </View>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}

export default Signin;
