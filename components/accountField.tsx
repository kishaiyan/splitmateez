import { View, Text, TextInput } from 'react-native'
import React from 'react'

const AccountField = ({name,text}) => {
  return (
    <View className='flex-row items-center justify-between mb-4'>
      <Text className='text-white'>{name}</Text>
      <View className=' w-[85%] bg-tile p-2 rounded-md'>
      <TextInput value={text} editable={name!=="Email" && name!=="Phone"} className={name==="Email" ||  name==="Phone" ? "text-gray-400":"text-gray-100"}></TextInput>
       
        
      </View>
    </View>
  )
}

export default AccountField