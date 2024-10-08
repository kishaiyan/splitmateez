import Button from "../components/customButton";
import React from 'react';
import { View,Image,Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Redirect } from "expo-router";
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from "../src/amplifyconfiguration.json";
import { useGlobalContext } from "../context/GlobalProvider";
import AppBar from "../components/appBar";
import { Buffer } from "buffer";

global.Buffer=Buffer;

Amplify.configure(config);

const client = generateClient();

export default function app(){
  
  const icon=require('../assets/images/splash_screen.jpg')
  
  const { state, dispatch } = useGlobalContext();
  const { isLoading, userType,isLoggedIn } = state;
 
  if(!isLoading && isLoggedIn && userType=="Owner") {
    return <Redirect href="/(home)/home" />}
   
  else if(!isLoading && isLoggedIn && userType!="Owner") {
      return <Redirect href="/tenant_home" />}
  // return <Redirect href={"/(home)/home"}/>
  
  return(
  
  <SafeAreaView className="flex-1 items-center bg-primary">
   
   <AppBar leading={false}/>
   
    <View className="realtive mt-8 h-full w-full">
      <Image
        source={icon} 
        className="w-screen h-screen"
      />
      <View className="absolute bg-black/80  items-center justify-evenly w-full h-[30%] bottom-[5%] " style={{borderTopLeftRadius:15,borderTopRightRadius:15,}} >
        
        
        <Button 
        title="Get Started !"
        handlePress={()=>
          router.push('/signIn')}
        containerStyle="w-[70%] min-h-[62px]"
        textStyle="text-white"
        />
        <View className=" h-[10%]"></View>

      
      </View>
    </View>
    
  </SafeAreaView>
    
  )
}

