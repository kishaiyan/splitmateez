import { View, Text, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/customButton';
import { router, useLocalSearchParams } from 'expo-router';
import AppBar from '../../components/appBar';
import { confirmUserSignUp, resendVerificationCode } from '../../lib/aws-amplify';



const ConfirmEmail = () => {

  const { email } = useLocalSearchParams();
  const [code, setCode] = useState(null);



  const onSubmit = () => {
    const status = confirmUserSignUp(email.toString(), code);
    if (status) {
      router.replace("/signIn")
    }
  };

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      <AppBar leading={false} />
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
        <Pressable onPress={() => resendVerificationCode(email.toString())}>
          <View className='mt-3 px-2 py-3 bg-blue-400/40 rounded-md'>
            <Text className='text-white font-bold'>Resend Code</Text>

          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmEmail;
