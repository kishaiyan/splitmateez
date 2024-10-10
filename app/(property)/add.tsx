import { View, Text, ScrollView, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../components/appBar'
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { uploadData } from 'aws-amplify/storage';
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from 'expo-router';
import client from "../../lib/client";
import { createProperty } from '../../src/graphql/mutations';
import { useGlobalContext } from '../../context/GlobalProvider';

const AddProperty = () => {

  const [image,setImage]=useState(null);
  const { state, dispatch, AddProperty } = useGlobalContext();
  const { userDetails } = state;
  const [propertyForm,setPropertyForm]=useState({
    address:"",
    rooms:"",
    bathroom:"",
    parking:"",
    photo:"",
    maximun:"",
  })
  
  // Include addProperty

const addProperty = async () => {
  try {
    const response = await client.graphql({
      query: createProperty,
      variables: {
        input: {
          address: propertyForm.address,
          rooms: propertyForm.rooms,
          maximum: propertyForm.maximun,
          bathroom: propertyForm.bathroom,
          parking: propertyForm.parking,
          photo: propertyForm.photo,
          ownerID: userDetails.id,
        },
      },
    });

    const newProperty = response.data.createProperty;
    router.back() 
   
    AddProperty(newProperty);

  } catch (error) {
    console.log(error);
  }
};


  const uploadImage=async(path)=>{
    try {
      if (!path) {
        throw new Error("No photo selected");
      }
      console.log(path);
      const response = await fetch(path);
      const blob = await response.blob();
      const result=await uploadData({
        path:`public/${Date.now()}.jpeg`,
        data:blob,
        options:{
          contentType:'image/jpeg',
        }
      }).result;
      return result.path;
   
    } catch (error) {   
      console.log("Error :",error);
    }
  }
  
  const handleImage=async()=>{

    const result=await ImagePicker.launchImageLibraryAsync({
      selectionLimit:10,
      allowsEditing:true,
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      aspect:[4,3],
      quality:1,
    })
    if(!result.canceled){
      const selectedImage = result.assets[0].uri; // Get the URI of the selected image
      setImage(selectedImage); // Update state with the selected image URI
  
      // Directly pass the selected image URI to uploadImage
      const final=await uploadImage(selectedImage);
      setPropertyForm({...propertyForm,photo:final})
     
    }
  }
  return (
    

    <SafeAreaView className='flex-1 bg-primary px-4'>
      <Stack.Screen
      options={{
        headerShown:false
      }}
      />
      <AppBar leading={true}/>
      <View>
        <Text className='text-secondary text-xl mb-5'>
            ADD PROPERTY
        </Text>
      </View>
      <View>
        <ScrollView className='h-[82%]' showsVerticalScrollIndicator={false} >
          <View className='items-center'>
           <Pressable onPress={handleImage} className='mb-3'>
            <Image source={image ?{uri:image} :require("../../assets/images/home_holder.jpg")} style={{width:200,height:200,borderRadius:9}}/>
            </Pressable>

          <TextField 
          label="Address" 
          placeholder="123,qwerty st state postcode" 
          value={propertyForm.address} 
          onhandleChange={(e) => setPropertyForm({ ...propertyForm, address: e })}
          keyboardtype="" 
          error=""/>
          <TextField 
          label="Rooms"
          placeholder="2" 
          value={propertyForm.rooms} 
          onhandleChange={(e) => setPropertyForm({ ...propertyForm, rooms: e })}
          keyboardtype="numeric"
           error=""/>
          <TextField 
          label="Bathroom" 
          placeholder="4" 
          value={propertyForm.bathroom} 
          onhandleChange={(e) => setPropertyForm({ ...propertyForm, bathroom: e })}
          keyboardtype="numeric" 
          error=""/>
          <TextField
          label="Parking_space" 
          placeholder="4" 
          value={propertyForm.parking} 
          onhandleChange={(e) => setPropertyForm({ ...propertyForm, parking: e })}
          keyboardtype="numeric" 
          error=""/>
          <TextField 
          label="Maximum occupants" 
          placeholder="4" 
          value={propertyForm.maximun} 
          onhandleChange={(e) => setPropertyForm({ ...propertyForm, maximun: e })}
          keyboardtype="numeric" 
          error=""/>
          
          <Button title="Add Property" className='px-10 py-3 my-3' onPress={addProperty}/>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  )
}

export default AddProperty