import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/customButton';
import { useLocalSearchParams, router } from 'expo-router';
import { confirmSignUp , type ConfirmSignUpInput} from 'aws-amplify/auth';
import AppBar from '../../components/appBar';



const ConfirmEmail = () => {
  
  const { email,user } = useLocalSearchParams();
  const userEmail="something.@fmjrap.clm";
  const [code, setCode] = useState(null);

  async function handleSignUpConfirmation({
    username,
    confirmationCode
  }: ConfirmSignUpInput ){
    try{
      const {isSignUpComplete}=await confirmSignUp({
        username,confirmationCode
      });
      if(isSignUpComplete){
        router.replace('/signIn');
      }
    }
    catch (err){
      console.log(err);
    }
  }

  const onSubmit = () => {
    handleSignUpConfirmation({
      username:user.toString(),
      confirmationCode:code
    })
  };

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      <AppBar />
    {/* // appBar */}
    
      <View className='h-full bg-primary w-full items-center px-3'>
        <View className=' w-full h-[5%] my-5'>
          <Text className='text-white text-center text-2xl font-sans'>Confirm your Email</Text>
        </View>
        <View className=' w-full h-[15%] justify-evenly'>
          <Text className='text-white text-xl font-sans'>Please enter the verification code to confirm your email address</Text>
          <Text className='text-white text-sm'>Email has been sent to {email}</Text>
        </View>
        <View className='h-[250px] justify-center'>
          <TextInput
            keyboardType='number-pad'
            value={code}
            onChangeText={(text) => setCode(text)}
            className='border text-gray-200 border-gray-400 h-[40%] text-3xl rounded-md'
            textAlign='center'
            placeholder='******'
            placeholderTextColor="#dddddd35"
            style={{ letterSpacing: 26, width: 300 }}
            maxLength={6}
          />
        </View>
        <Button title='Confirm Email' containerStyle='px-10 py-3' onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmEmail;
