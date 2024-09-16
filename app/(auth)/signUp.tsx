import { View, Text, ScrollView,Image, Pressable  } from 'react-native';
import React, { useState } from 'react';
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


const client = generateClient();





type signupParameters = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  address:string,
  password: string,
  photo: object,
};


const Signup = () => {
  
  function getNumber(phone: string) {
    return phone.replace('0', '+61');
  }
  
  async function handlesignUp(
    { firstname, lastname, email, phone,address, password }: signupParameters,
    router: any // Use appropriate type for navigation
  ) {
    try {
     let photo='';
      const {isSignUpComplete,userId,nextStep} = await signUp({
        username: email,
        password,
        options:{
          userAttributes: {
              email,
              phone_number: getNumber(phone),
              given_name: firstname,
              family_name: lastname,
              address,
            },
            
            autoSignIn: { enabled: true },
        }
      });
      if(userId){
        const photoURL=await uploadImage();
        const URI='https://splitmate62a9bfe38a7f46bebb291853db82950142ddd-dev.s3.ap-southeast-2.amazonaws.com/'
        photo=URI+photoURL;
      }
      await client.graphql({query:createOwner,variables:{
        input:{
          id:userId,
          firstName:firstname,
          lastName:lastname,
          phNo:phone,
          email:email,
          photo:photo,
        }
      }})
      

      if( !isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP" ){
        router.replace(`/confirmEmail?email=${encodeURIComponent(email)}&user=${encodeURIComponent(userId)}`)
      }
      
    } catch (error) {
      console.log('error signing up:', error);
    }
    
  }
  const uploadImage=async()=>{
    try {
      if (!form.photo) {
        throw new Error("No photo selected");
      }
      const response = await fetch(form.photo.uri);
      const blob = await response.blob();
      const result=await uploadData({
        path:`public/${form.photo.fileName}`,
        data:blob,
      }).result;
      console.log(result.path);

      return result.path;
   
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
      console.log(result);
      setForm({...form, photo:result.assets[0]});
     
    }
  }
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    phno: '',
    photo:null
  });

  const [errors, setErrors] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    phno: '',
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      phno: '',
      photo:''
    };

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
      newErrors.email = 'photo is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const onSubmit = () => {
    if (validateForm()) {
      handlesignUp({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone: form.phno,
        address:"something",
        password: form.password,
        photo:form.photo,
      }, router);
      
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-primary px-5'>
      <AppBar />
      <View className='items-start'>
                <Text className="text-secondary text-xl">REGISTER</Text>
      </View>
        <ScrollView className="flex-1"  showsVerticalScrollIndicator={false}>
          {/* <View className="flex-1"> */}
              
                <View className="px-4 my-2 items-center justify-between">
                <Pressable onPress={handleImage}>
            <Image source={form.photo ? {uri:form.photo.uri} :require("../../assets/images/Avatar.jpg")} style={{width:100,height:100,borderRadius:50}} resizeMode='contain'/>
            </Pressable>
                  <View className="items-center">
                    <TextField
                      label="Email"
                      value={form.email}
                      onhandleChange={(e) => setForm({ ...form, email: e })}
                      placeholder="john.doe@something.com"
                      keyboardtype="email-address"
                      error={errors.email}
                    />
                    <TextField
                      label="First Name"
                      value={form.firstname}
                      onhandleChange={(e) => setForm({ ...form, firstname: e })}
                      placeholder="John"
                      keyboardtype="default"
                      error={errors.firstname}
                    />
                    <TextField
                      label="Last Name"
                      value={form.lastname}
                      onhandleChange={(e) => setForm({ ...form, lastname: e })}
                      placeholder="Doe"
                      keyboardtype="default"
                      error={errors.lastname}
                    />
                    <TextField
                      label="Phone Number"
                      value={form.phno}
                      onhandleChange={(e) => setForm({ ...form, phno: e })}
                      keyboardtype="number-pad"
                      placeholder="04.."
                      error={errors.phno}
                    />
                    <TextField
                      label="Password"
                      value={form.password}
                      onhandleChange={(e) => setForm({ ...form, password: e })}
                      keyboardtype="default"
                      placeholder="Password"
                      error={errors.password}
                    />
                    <Button title='Sign Up' containerStyle='mt-6 px-10 py-2' onPress={onSubmit} />
                    <View className='w-[80%] mt-5 pt-3 flex-row gap-2'>
                      <AntDesign name='checksquareo' color="green" size={16}/>
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
                    <View className='w-2 h-2 bg-transparent'>
                    
                    </View>
                  </View>
            </View>
        </ScrollView>
      
    </SafeAreaView>
  );
}

export default Signup;
