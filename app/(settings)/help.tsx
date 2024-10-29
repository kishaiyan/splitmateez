import AppBar from '../../components/appBar';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Help = () => {
  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-4'>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBar leading={true} />
      <View className='flex-1 items-center'>
        <Text className='text-white text-2xl font-bold mb-4'>Help & Support</Text>
      </View>
    </SafeAreaView>
  );
};

export default Help; 