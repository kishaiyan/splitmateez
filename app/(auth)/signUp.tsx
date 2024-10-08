import { View, Text, ScrollView, Image, Pressable, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import TextField from '../../components/textField';
import { signUp } from 'aws-amplify/auth';
import Button from '../../components/customButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AppBar from '../../components/appBar';
import { generateClient } from 'aws-amplify/api';
import * as ImagePicker from "expo-image-picker";
import { uploadData } from 'aws-amplify/storage';
import { createOwner } from '../../src/graphql/mutations';
import { useGlobalContext } from '../../context/GlobalProvider';

const client = generateClient();

const Signup = () => {
  const { isLoading, setIsLoading } = useGlobalContext();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    phno: '',
    photo: null,
    errors: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      phno: '',
      photo: ''
    }
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getNumber = (phone) => phone.replace('0', '+61');

  const validateForm = () => {
    let valid = true;
    let newErrors = { ...form.errors };

    if (!form.email) {
      newErrors.email = 'Email is required';
      valid = false;
    }

    if (!form.firstname) {
      newErrors.firstname = 'First name is required';
      valid = false;
    }

    if (!form.lastname) {
      newErrors.lastname = 'Last name is required';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    if (!form.phno) {
      newErrors.phno = 'Phone number is required';
      valid = false;
    }

    if (!form.photo) {
      newErrors.photo = 'Photo is required';
      valid = false;
    }

    setForm(prev => ({ ...prev, errors: newErrors }));
    return valid;
  };

  const handleImage = async () => {
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
              handleChange('photo', cameraResult.assets[0]);
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
              handleChange('photo', libraryResult.assets[0]);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const uploadImage = async (userId) => {
    try {
      if (!form.photo) throw new Error("No photo selected");
      
      const response = await fetch(form.photo.uri);
      const blob = await response.blob();
      
      const result  = await uploadData({
        path: `public/${userId}.jpeg`,
        data: blob,
        options: {
          contentType: 'image/jpeg',
        },
      }).result;

      return result.path;

    } catch (error) {
      console.log("Error during image upload:", error);
      throw error;
    }
  };

  const handlesignUp = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const { userId, nextStep, isSignUpComplete } = await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
            phone_number: getNumber(form.phno),
            given_name: form.firstname,
            family_name: form.lastname,
          },
          autoSignIn: { enabled: false },
        },
      });

      let photoUrl = '';
      if (userId) {
        photoUrl = await uploadImage(userId);
      }

      await client.graphql({
        query: createOwner,
        variables: {
          input: {
            id: userId,
            firstName: form.firstname,
            lastName: form.lastname,
            phNo: form.phno,
            email: form.email,
            photo: photoUrl,
          },
        },
      });

      if (!isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        router.replace(`/confirmEmail?email=${encodeURIComponent(form.email)}&user=${encodeURIComponent(userId)}`);
      }

    } catch (error) {
      console.log('Error signing up:', error);
      Alert.alert("Sign Up Failed", "There was an error signing you up. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    handlesignUp();
  };

  return (
    <SafeAreaView className='flex-1 bg-primary px-5'>
      <AppBar leading={false} />
      <View className='items-start'>
        <Text className="text-secondary text-xl">REGISTER</Text>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 my-2 items-center justify-between">
          <Pressable onPress={handleImage}>
            <Image source={form.photo ? { uri: form.photo.uri } : require("../../assets/images/Avatar.jpg")} style={{ width: 100, height: 100, borderRadius: 50 }} resizeMode='contain' />
          </Pressable>
          <View className="items-center">
            <TextField
              label="Email"
              value={form.email}
              onhandleChange={(e) => handleChange('email', e)}
              placeholder="john.doe@something.com"
              keyboardtype="email-address"
              error={form.errors.email}
            />
            <TextField
              label="First Name"
              value={form.firstname}
              onhandleChange={(e) => handleChange('firstname', e)}
              placeholder="John"
              keyboardtype="default"
              error={form.errors.firstname}
            />
            <TextField
              label="Last Name"
              value={form.lastname}
              onhandleChange={(e) => handleChange('lastname', e)}
              placeholder="Doe"
              keyboardtype="default"
              error={form.errors.lastname}
            />
            <TextField
              label="Phone Number"
              value={form.phno}
              onhandleChange={(e) => handleChange('phno', e)}
              keyboardtype="number-pad"
              placeholder="04.."
              error={form.errors.phno}
            />
            <TextField
              label="Password"
              value={form.password}
              onhandleChange={(e) => handleChange('password', e)}
              keyboardtype="default"
              placeholder="Password"
              error={form.errors.password}
            />
            <Button title='Sign Up' containerStyle='mt-6 px-10 py-2' onPress={onSubmit} isLoading={isLoading} />
            <View className='w-[80%] mt-5 pt-3 flex-row gap-2'>
              <AntDesign name='checksquareo' color="green" size={16} />
              <Text className='text-gray-200 text-xs'>By signing up you agree to our terms and conditions</Text>
            </View>
          </View>

          <View className="w-full mt-6">
            <View className="flex-row items-center justify-between">
              <View className="border-b border-gray-300 flex-1" />
              <Text className="text-white text-xl mx-2">OR</Text>
              <View className="border-b border-gray-300 flex-1" />
            </View>
            <View className='flex mt-5 items-center justify-center'>
              <Text className='text-white mr-2'>Have an account already?</Text>
              <Link href="/signIn" className='text-secondary text-xl'>Sign In</Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
