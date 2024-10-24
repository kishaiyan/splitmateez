import { View, Text, TextInput } from 'react-native'
import React from 'react'

const AccountField = ({ value, onChangeText, secureTextEntry = false }) => {
  return (
    <View testID="account-field-container" className='flex-row items-center justify-between mb-4'>
      <View testID="account-field-input-container" className=' w-[85%] bg-tile p-2 rounded-md'>
        <TextInput
          testID="account-field-input"
          value={value}
          onChangeText={onChangeText}
          className="text-gray-400"
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  )
}

export default AccountField
