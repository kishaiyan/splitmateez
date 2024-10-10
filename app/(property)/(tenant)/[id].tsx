
import { View,Text,Image, Pressable } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGlobalContext } from '../../../context/GlobalProvider';
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Button from '../../../components/customButton';

 const TenantAbout = () => {
  const { id } = useLocalSearchParams();
  const { state, dispatch } = useGlobalContext();
  const { properties } = state;
   // Assuming you have Redux setup

  // Find the tenant based on the ID
  const tenantDetails = properties.flatMap(property => property.tenants)
                                   .find(tenant => tenant.id === id);

  const removeProperty=()=>{

  }
  
  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      
      <Stack.Screen 

      options={{
        headerShown:false,
      }}
      />
      <View>
        <Pressable className='mr-2 h-10' onPress={()=>router.back()}>
          <AntDesign name="arrowleft" size={25} color="#fff" /> 
        </Pressable>
      </View>
    <View className='items-center'>
      <Image source={{
        uri:tenantDetails.photo
      }} style={{width:200,height:200,marginBottom:16,borderRadius:15}} 
      resizeMode='contain'/>
    </View>
    <Text className='text-white text-xl'>{tenantDetails.firstName} {tenantDetails.lastName}</Text>
    <Text className='text-white text-xs'>{tenantDetails.phNo}</Text>
    <Text className='text-white text-md'>{tenantDetails.email}</Text>


    <View className='items-center justify-evenly flex-row my-5'>
              <View className='items-center'>
                
                <Ionicons name='flash' size={35} color={tenantDetails.useElectricity?"#BD6A33":"#424242"}/>
                <Text className='text-gray-100 font-light text-xs'>power</Text>

              </View>

              <View className='items-center'>
               
                <Ionicons name='water' size={35} color={tenantDetails.useWater?"#BD6A33":"#424242"}/>
                <Text className='text-gray-100 font-light text-xs'>water</Text>

              </View>

              <View className='items-center'>
               
                <Ionicons name='wifi' size={35} color={tenantDetails.useInternet?"#BD6A33":"#424242"}/>
                <Text className='text-gray-100 font-light text-xs'>internet</Text>

              </View>

              <View className='items-center'>

                <FontAwesome5 name='fire' size={32} color={tenantDetails.useGas?"#BD6A33":"#424242"}/>
                <Text className='text-gray-100 font-light text-xs'>gas</Text>

              </View>
            </View>
          <View>
            <View className='w-full h-[50%] bg-tile items-center justify-evenly rounded flex-row'>
              <View>
                <FontAwesome6 name="money-bills" size={30} color={"#4f8a41"}/>
              </View>
              <View className='h-[90%] justify-center'>
                <Text className='text-xl text-orange-400 pb-2'>The Total utility cost</Text>
                <Text className='text-3xl text-gray-300'>{'$'}{tenantDetails.costAmount}</Text>
              </View>
            </View>
            <View className='items-center'>

                <Button 
                title="Remove" 
                className='px-5 py-1 bg-signOut border border-red-500 mt-5'
                onPress={removeProperty}
                />
              </View>
          </View>
  </SafeAreaView>
  );
};
export default TenantAbout