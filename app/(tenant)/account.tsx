import { View, Text, Image, KeyboardAvoidingView, Pressable } from 'react-native'
import React from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import AppBar from '../../components/appBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { Alert } from 'react-native'



const Account = () => {
  const { state, dispatch } = useGlobalContext();
  const { userDetails } = state;

  const signOut = async () => {
    try {
      await handleSignOut();
      router.replace('/(auth)/signIn');
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      // console.error('Error during sign out:', error);
      // Add user feedback for sign out failure
      Alert.alert(
        "Sign Out Failed",
        "There was an error signing out. Please try again.",
        [{ text: "OK" }]
      );
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <KeyboardAvoidingView
        behavior='padding'>
        <AppBar leading={false} />
        <View>

          <View className='mb-6'>
            <View className='items-center flex-row justify-evenly bg-tile p-4 rounded-lg mb-4'>
              <Image
                source={{ uri: userDetails.photo }}
                style={{ width: 100, height: 100, marginBottom: 16, borderRadius: 50 }}
                resizeMode='cover'
                onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)} />
              <View className='flex-col items-center justify-center'>
                <Text className='text-zinc-200 text-xl'>{userDetails.firstName} {userDetails.lastName}</Text>
                <Text className='text-secondary text-md'>{userDetails.email}</Text>
              </View>
            </View>
            <Pressable onPress={() => router.push("../(settings)/editProfile")}>
              <View className='bg-tile px-4 py-5 rounded-lg flex-row items-center mb-2'>
                <View className='mr-5'>
                  <MaterialIcons name="edit" size={22} color="#cdcdcd" />
                </View>
                <Text className='text-zinc-200 text-md'>Edit Profile</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.push("../(settings)/changePassword")}>
              <View className='bg-tile px-4 py-5 rounded-lg flex-row items-center mb-2'>
                <View className='mr-5'>
                  <MaterialIcons name="lock" size={22} color="#cdcdcd" />
                </View>
                <Text className='text-zinc-200 text-md'>Change Password</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.push("../(settings)/notificationSettings")}>
              <View className='bg-tile px-4 py-5 rounded-lg flex-row items-center mb-2'>
                <View className='mr-5'>
                  <MaterialIcons name="notifications" size={22} color="#cdcdcd" />
                </View>
                <Text className='text-zinc-200 text-md'>Notification Settings</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.push("../(settings)/reportGenerate")}>
              <View className='bg-tile px-4 py-5 rounded-lg flex-row items-center mb-2'>
                <View className='mr-5'>
                  <MaterialIcons name="note" size={22} color="#cdcdcd" />
                </View>
                <Text className='text-zinc-200 text-md'>Usage Summary</Text>
              </View>
            </Pressable>

          </View>
          <View className='items-center'>
            <Button title='Sign Out' containerStyle='px-10 py-3 bg-signOut border border-red-500' onPress={signOut} />
          </View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default Account
