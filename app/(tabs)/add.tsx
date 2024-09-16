import { View, Text, ScrollView, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { uploadData } from 'aws-amplify/storage';
import * as ImagePicker from "expo-image-picker";

const AddProperty = () => {
  const [image,setImage]=useState(null);


  
  
  const addProperty=()=>{

  }

  const uploadImage=async()=>{
    try {
      const result=await uploadData({
        path:({identityId})=>`protected/${identityId}/property/prop.jpg`,
        data:image,
      }).result;
      console.log("Succeeded: ",result)
    } catch (error) {
      console.log("Error :",error);
      
    }
  }
  
  const handleImage=async()=>{

    const result=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[1,1],
      quality:1,
    })
    if(!result.canceled){
      setImage(result.assets[0].uri);
      uploadImage();
    }
  }
  return (
    

    <SafeAreaView className='flex-1 bg-primary px-4'>
      <AppBar/>
      <View>
        <Text className='text-secondary text-xl'>
            ADD PROPERTY
        </Text>
      </View>
      <View>
        <ScrollView className='h-[74%]' showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:40}}>
          <View className='items-center'>
           <Pressable onPress={handleImage}>
            <Image source={image ?{uri:image} :require("../../assets/images/home_holder.jpg")} style={{width:200,height:200,borderRadius:9}}/>
            </Pressable>

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