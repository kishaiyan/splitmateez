import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Button from '../../components/customButton'
import { useEffect, useState } from 'react'
import client from '../../lib/client'
import { updateOwner } from '../../src/graphql/mutations'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/appBar';
import { Stack } from 'expo-router';
import AccountField from '../../components/accountField';

export default function EditProfile() {
  const { state } = useGlobalContext();
  const { userDetails } = state;
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setFirstName(userDetails.firstName)
        setLastName(userDetails.lastName)

      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    fetchUserDetails()
  }, [])

  const updateUser = async ({ firstName, lastName }) => {
    try {
      const { state, dispatch } = useGlobalContext();
      const { user } = state;
      const updatedUser = await client.graphql({
        query: updateOwner,
        variables: {
          input: {
            id: user,
            firstName,
            lastName,
          }
        }
      });
      dispatch({ type: 'SET_USER_DETAILS', payload: updatedUser });
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUser({
        firstName,
        lastName,
      })

      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-4'>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBar leading={true} />
      <View className='flex-1 items-center'>
        <Text className='text-white text-2xl font-bold mb-4'>Edit Profile</Text>
        <View className='items-start'>
          <Text className='text-white text-md mb-2'>FirstName</Text>
          <AccountField value={firstName} onChangeText={setFirstName} />
        </View>
        <View className='items-start'>
          <Text className='text-white text-md mb-2'>LastName</Text>
          <AccountField value={lastName} onChangeText={setLastName} />
        </View>
      </View>
      <Button title='Update Profile' onPress={handleUpdateProfile} className='px-3 py-2 mb-4' />
    </SafeAreaView>
  )
}

