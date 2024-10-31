import { View, Text, ScrollView, Image, Pressable } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
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

  const [image, setImage] = useState(null);
  const { state, dispatch, addProperty } = useGlobalContext();
  const { userDetails } = state;
  const [propertyForm, setPropertyForm] = useState({
    address: "",
    rooms: "",
    bathroom: "",
    parking: "",
    photo: "",
    maximun: "",
  })
  const [isFormComplete, setIsFormComplete] = useState(false); // Added to track form completeness

  // Include addProperty
  const addPropertytoUser = useCallback(async () => {
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
      })

      const newProperty = response.data.createProperty
      await addProperty(newProperty);
      router.back();
    } catch (error) {
      console.log(error)
    }
  }, [propertyForm, userDetails, AddProperty])

  const uploadImage = async (path) => {
    try {
      if (!path) {
        throw new Error("No photo selected");
      }
      console.log(path);
      const response = await fetch(path);
      const blob = await response.blob();
      const result = await uploadData({
        path: `property/${Date.now()}.jpeg`,
        data: blob,
        options: {
          contentType: 'image/jpeg',
        }
      }).result;
      return result.path;

    } catch (error) {
      console.log("Error :", error);
    }
  }

  const handleImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      selectionLimit: 10,
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri; // Get the URI of the selected image
      setImage(selectedImage); // Update state with the selected image URI

      // Directly pass the selected image URI to uploadImage
      const final = await uploadImage(selectedImage);
      setPropertyForm({ ...propertyForm, photo: final })

    }
  }

  useEffect(() => {
    checkFormCompleteness(); // Check form completeness on mount
  }, [propertyForm]);

  const checkFormCompleteness = () => {
    const { address, rooms, bathroom, parking, maximun, photo } = propertyForm;
    if (address && rooms && bathroom && parking && maximun && photo) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }

  return (


    <SafeAreaView className='flex-1 bg-primary px-4'>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <AppBar leading={true} />
      <View>
        <Text className='text-secondary text-xl mb-5'>
          ADD PROPERTY
        </Text>
      </View>
      <View>
        <ScrollView className='h-[82%]' showsVerticalScrollIndicator={false} >
          <View className='items-center'>
            <Pressable onPress={handleImage} className='mb-3'>
              <Image source={image ? { uri: image } : require("../../assets/images/home_holder.jpg")} style={{ width: 150, height: 150, borderRadius: 9 }} />
            </Pressable>

            <TextField
              label="Address"
              placeholder="123,qwerty st state postcode"
              value={propertyForm.address}
              onhandleChange={(e) => setPropertyForm({ ...propertyForm, address: e })}
              keyboardtype=""
              secureTextEntry={false} />
            <TextField
              label="Rooms"
              placeholder="2"
              value={propertyForm.rooms}
              onhandleChange={(e) => setPropertyForm({ ...propertyForm, rooms: e })}
              keyboardtype="numeric"
              secureTextEntry={false} />

            <TextField
              label="Bathroom"
              placeholder="4"
              value={propertyForm.bathroom}
              onhandleChange={(e) => setPropertyForm({ ...propertyForm, bathroom: e })}
              keyboardtype="numeric"
              secureTextEntry={false} />

            <TextField
              label="Parking_space"
              placeholder="4"
              value={propertyForm.parking}
              onhandleChange={(e) => setPropertyForm({ ...propertyForm, parking: e })}
              keyboardtype="numeric"
              secureTextEntry={false} />

            <TextField
              label="Maximum occupants"
              placeholder="4"
              value={propertyForm.maximun}
              onhandleChange={(e) => setPropertyForm({ ...propertyForm, maximun: e })}
              keyboardtype="numeric"
              secureTextEntry={false} />



            <Button title="Add Property" className='px-10 py-3 my-3' onPress={addPropertytoUser} />
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  )
}

export default AddProperty