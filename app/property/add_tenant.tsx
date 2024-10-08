import { View, Text, Pressable, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from '@expo/vector-icons';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { uploadData } from 'aws-amplify/storage';
import { signUp } from 'aws-amplify/auth';
import { createTenant } from '../../src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { useGlobalContext } from '../../context/GlobalProvider';

const AddTenant = () => {
  const client=generateClient();
  const params = useLocalSearchParams();
  const {isLoading, setIsLoading}=useGlobalContext();
  const { id,address } = params;
  const [tenantForm, setTenantForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phno: '',
    photo: null,
  });
  const getImage=()=>{
    Alert.alert( 
      
      "Select Image",
      "Choose an image from your library or take a new photo.",
      [
        {
          text: "Camera",
          onPress: async () => {
            const cameraResult = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!cameraResult.canceled) {
              setTenantForm({ ...tenantForm, photo: cameraResult.assets[0] });
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const libraryResult = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!libraryResult.canceled) {
              setTenantForm({ ...tenantForm, photo: libraryResult.assets[0] });
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  }
  useEffect(()=>{

  },[]);
  function getNumber(phone: string) {
    return phone.replace('0', '+61');
  }
  const generate=(firstname,lastname)=>{
      const capitalize = (str) => str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
      // Capitalize the first letter of both firstname and lastname
      const capitalizedFirstName = capitalize(firstname);
      const capitalizedLastName = capitalize(lastname);
      const result = `${capitalizedFirstName}${capitalizedLastName}@1`;

      return result;
  }

  const handleTenant=async()=>{ 
    setIsLoading(true);
    const {userId}= await signUp({
      username: tenantForm.email,
        password:generate(tenantForm.firstname,tenantForm.lastname),
        options:{
          userAttributes: {
              email:tenantForm.email,
              phone_number: getNumber(tenantForm.phno),
              given_name: tenantForm.firstname,
              family_name: tenantForm.lastname,
              address:address.toString(),
            },
            autoSignIn: { enabled: false },
        }
    })
    if(userId){
    const photo=await uploadImage(userId);
    await client.graphql({
      query:createTenant,variables:{
      input:{
        id:userId,
        propertyID:id.toString(),
        firstName:tenantForm.firstname,
        lastName:tenantForm.lastname,
        phNo:tenantForm.phno,
        email:tenantForm.email,
        photo:photo,
        useElectricity:true,
        useInternet:true,
        useWater:true,
        useGas:true,
      }
    }})
    setIsLoading(false)
    router.back();
  }
  }

  const uploadImage=async(userId)=>{
    try {
      if (!tenantForm.photo) {
        throw new Error("No photo selected");
      }
      const response = await fetch(tenantForm.photo.uri);
      const blob = await response.blob();
      const result=await uploadData({
        path:`public/${userId}.jpeg`,
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

  

  return (
    <SafeAreaView className='bg-primary flex-1 px-4'>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='flex-1'> 
        <View className='flex-row items-center justify-between mb-4 pt-2'> 
          <Pressable onPress={router.back}>
            <AntDesign name='arrowleft' color={"#fff"} size={26} />
          </Pressable>
          <Text className='text-xl text-secondary'>Add Tenant</Text>
          <View className='w-6'></View>
        </View>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 my-2 items-center justify-between">
            <Pressable onPress={getImage}>
              <Image
                source={tenantForm.photo ? { uri: tenantForm.photo.uri } : require("../../assets/images/Avatar.jpg")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode='contain'
              />
            </Pressable>
            <View className="items-center">
              <TextField
                label="Email"
                value={tenantForm.email}
                onhandleChange={(e) => setTenantForm({ ...tenantForm, email: e })}
                placeholder="john.doe@something.com"
                keyboardtype="email-address"
                error={""}
              />
              <TextField
                label="First Name"
                value={tenantForm.firstname}
                onhandleChange={(e) => setTenantForm({ ...tenantForm, firstname: e })}
                placeholder="John"
                keyboardtype="default"
                error={""}
              />
              <TextField
                label="Last Name"
                value={tenantForm.lastname}
                onhandleChange={(e) => setTenantForm({ ...tenantForm, lastname: e })}
                placeholder="Doe"
                keyboardtype="default"
                error={""}
              />
              <TextField
                label="Phone Number"
                value={tenantForm.phno}
                onhandleChange={(e) => setTenantForm({ ...tenantForm, phno: e })}
                keyboardtype="number-pad"
                placeholder="04.."
                error={""}
              />
              <Button title='Add Tenant' containerStyle='mt-6 px-10 py-2' onPress={handleTenant} isLoading={isLoading}/>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AddTenant;
