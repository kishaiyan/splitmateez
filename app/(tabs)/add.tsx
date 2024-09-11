import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import * as ImagePicker from "expo-image-picker";

const AddProperty = () => {
  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar/>
      <View>
        <Text className='text-secondary text-xl'>
            ADD PROPERTY
        </Text>
      </View>
      <View>
        <ScrollView className='h-[74%]' showsVerticalScrollIndicator={false}>
          <View className='items-center'>
        <TextField label="Address" placeholder="123,qwerty st state postcode" value={""} onhandleChange={(e)=>{}} keyboardtype="" error=""/>
          <TextField label="Rooms" placeholder="2" value={""} onhandleChange={(e)=>{}} keyboardtype="numeric" error=""/>
          <TextField label="Bathroom" placeholder="4" value={""} onhandleChange={(e)=>{}} keyboardtype="numeric" error=""/>
          <TextField label="Parking_space" placeholder="4" value={""} onhandleChange={(e)=>{}} keyboardtype="numeric" error=""/>
          <TextField label="Maximum occupants" placeholder="4" value={""} onhandleChange={(e)=>{}} keyboardtype="numeric" error=""/>
          <TextField label="Maximum occupants" placeholder="4" value={""} onhandleChange={(e)=>{}} keyboardtype="numeric" error=""/>
          <Button title="Add Property" className='px-10 py-3 mt-3'/>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  )
}

export default AddProperty