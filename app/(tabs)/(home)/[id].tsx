import { Text, View, Image, ScrollView, Modal, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Href, router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import TenantCard from '../../../components/tenantCard';
import Button from '../../../components/customButton';

const PropertyDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, addTenantToProperty } = useGlobalContext();
  const { properties } = state;
  const [disProperty, setDisProperty] = useState(null);


  useEffect(() => {
    const getProperty = (id) => {
      const selectedProperty = properties.find((prop) => String(prop.id) === String(id));
      setDisProperty(selectedProperty);
    };

    if (id) {
      getProperty(id);
    } else {
      console.log("No Id");
    }
  }, [id, properties]);
  
  
  const toggleService = (tenantId, service) => {
    setDisProperty((prevProperty) => {
      const updatedTenants = prevProperty.tenants.map((tenant) => {
        if (tenant.id === tenantId) {
          return { ...tenant, [service]: !tenant[service] };
        }
        return tenant;
      });
      return { ...prevProperty, tenants: updatedTenants };
    });

    // Optionally, update global state if needed
    // You might want to dispatch an action here
  };

  const openModal=(tenant)=>{
    router.push(`/(tenant)/${tenant.id}` as Href)
  }

  const handleAddTenant = (newTenant) => {
    addTenantToProperty(disProperty.id, newTenant);
  };
  const removeProperty=()=>{

  }

  const toggleElectricity = (tenantId) => toggleService(tenantId, 'electricity');
  const toggleWater = (tenantId) => toggleService(tenantId, 'waterAccess');
  const toggleGas = (tenantId) => toggleService(tenantId, 'gas');
  const toggleWifi = (tenantId) => toggleService(tenantId, 'internet');

  return (
    <SafeAreaView className='flex-1 bg-primary px-3 pb-6'>
      <Stack.Screen options={{ headerShown: false }} />
      { disProperty ? (
        <>
          <View className='mb-3 items-center flex-row justify-between pt-2'>
            <Pressable onPress={() => router.back()}>
              <AntDesign name='arrowleft' size={26} color={"#fff"} />
            </Pressable>
            <Text className='text-secondary text-xl'>{disProperty.address}</Text>
            <View className='w-10 h-3'></View>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: disProperty.photo }}
              style={{ width: '100%', height: 250 }}
              resizeMode='contain'
            />
            <View className='flex-row justify-evenly p-3 items-center rounded-md bg-tile mt-4'>
              <View className='items-center gap-1'>
                <Ionicons name='bed' color={"#BD6A33"} size={20} />
                <Text className='text-white text-md'>{disProperty.rooms}</Text>
              </View>
              <View className='items-center gap-1'>
                <FontAwesome name='bath' color={"#BD6A33"} size={20} />
                <Text className='text-white text-md'>{disProperty.bathroom}</Text>
              </View>
              <View className='items-center gap-1'>
                <AntDesign name='car' color={"#BD6A33"} size={20} />
                <Text className='text-white text-md'>{disProperty.parking}</Text>
              </View>
              <View className='items-center gap-1'>
                <Text className='text-secondary text-md'>Max</Text>
                <Text className='text-white text-md'>{disProperty.maximum}</Text>
              </View>
              <View className='items-center gap-1'>
                <Text className='text-secondary text-md'>Now</Text>
                <Text className='text-white text-md'>{disProperty.tenants.length}</Text>
              </View>
            </View>

            <View>
              <View className='flex-row justify-between m-2 items-center'>
                <Text className='text-white text-lg font-bold m-2'>Tenants</Text>
                <Pressable onPress={() => router.push(`/property/add_tenant?id=${disProperty.id}&address=${disProperty.address}` as Href)}>
                  <AntDesign name='adduser' color={"#ffffff"} size={26} />
                </Pressable>
              </View>
              {disProperty.tenants.length > 0 ? (
                disProperty.tenants.map((tenant) => (
                  <TenantCard
                    onPress={()=>openModal(tenant)}
                    key={tenant.id}
                    tenant={tenant}
                  />
                ))
              ) : (
                <View className='items-center'>
                  <Text className='text-white font-semibold'>Add Tenants to Monitor the property</Text>
                </View>
              )}
              <View className='items-center'>

                <Button 
                title="Remove" 
                className='px-5 py-1 bg-signOut border border-red-500 mt-3'
                onPress={removeProperty}
                />
              </View>
              <View className='h-20'></View>
            </View>
          </ScrollView>
        </>
      ) : (
        <Text className='text-white'>Loading or Property not found...</Text>
      )}
    </SafeAreaView>
  );
};

export default PropertyDetails;
