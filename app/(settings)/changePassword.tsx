import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import Button from '../../components/customButton'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/appBar';
import { Stack } from 'expo-router';
import { changePassword } from '../../lib/aws-amplify';
import AccountField from '../../components/accountField';
import { Snackbar } from 'react-native-paper';

export default function ChangePassword() {

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [visible, setVisible] = useState(false);
  const handleChangePassword = () => {
    if (oldPassword === '' || newPassword === '') {
      Alert.alert('Error', 'Please enter your old password and new password')
    }
    else if (oldPassword === newPassword) {
      Alert.alert('Error', 'New password cannot be the same as old password')
    }
    else {
      changePassword({ oldPassword, newPassword })
      setOldPassword('')
      setNewPassword('')
    }
  }





  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-4'>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBar leading={true} />
      <View className='flex-1 items-center'>
        <Text className='text-white text-2xl font-bold mb-4'>Change Password</Text>
        <View className='items-start'>
          <Text className='text-white text-md mb-2'>Old Password</Text>
          <AccountField value={oldPassword} onChangeText={setOldPassword} secureTextEntry={true} />
        </View>
        <View className='items-start'>
          <Text className='text-white text-md mb-2'>New Password</Text>
          <AccountField value={newPassword} onChangeText={setNewPassword} secureTextEntry={true} />
        </View>
      </View>

      <Button title='Change' onPress={handleChangePassword} className='px-3 py-2 mb-4' />
    </SafeAreaView>
  )
}

