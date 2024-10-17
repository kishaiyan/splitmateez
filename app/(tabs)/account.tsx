import { View, Text, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React from 'react'
import Button from '../../components/customButton'
import { handleSignOut } from '../../lib/aws-amplify'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import AppBar from '../../components/appBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { Switch } from 'react-native-paper'
import ThemeToggle from '../../components/ThemeToggle'

// Function to get pre-signed URL for the image


const Account = () => {
  const { state, dispatch } = useGlobalContext();
  const { userDetails } = state;

  const signOut = async () => {
    try {
      await handleSignOut();
      dispatch({ type: 'SIGN_OUT' });
      router.replace('/(auth)/signIn');
    } catch (error) {
      console.error('Error during sign out:', error);
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
            <View className='bg-tile px-4 py-2 rounded-lg flex-row items-center mb-2'>
              <View className='mr-5'>
                <MaterialIcons name="edit" size={22} color="#cdcdcd" />
              </View>
              <Link href="../(settings)/editProfile">
                <Text className='text-zinc-200 text-md'>Edit Profile</Text>
              </Link>
            </View>
            <View className='bg-tile px-4 py-2 rounded-lg flex-row items-center mb-2'>
              <View className='mr-5'>
                <MaterialIcons name="lock" size={22} color="#cdcdcd" />
              </View>
              <Link href="../(settings)/changePassword">
                <Text className='text-zinc-200 text-md'>Change Password</Text>
              </Link>
            </View>
            <View className='bg-tile px-4 py-2 rounded-lg flex-row items-center mb-2'>
              <View className='mr-5'>
                <MaterialIcons name="notifications" size={22} color="#cdcdcd" />
              </View>
              <Link href="/notificationSettings">
                <Text className='text-zinc-200 text-md'>Notification Settings</Text>
              </Link>
            </View>
            <View className='bg-tile px-4 py-2 rounded-lg flex-row items-center mb-2'>
              <View className='mr-5'>
                <MaterialIcons name="help" size={22} color="#cdcdcd" />
              </View>
              <Link href="/help">
                <Text className='text-zinc-200 text-md'>Help & Support</Text>
              </Link>
            </View>
            <View className='bg-tile px-4 py-2 rounded-lg flex-row items-center mb-2'>
              <View className='mr-5'>
                <MaterialIcons name="privacy-tip" size={22} color="#cdcdcd" />
              </View>
              <Link href="/privacyPolicy">
                <Text className='text-zinc-200 text-md'>Privacy Policy</Text>
              </Link>
            </View>

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