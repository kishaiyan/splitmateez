import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../../../lib/client';
import { updateTenant, deleteTenant } from '../../../../src/graphql/mutations';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Button from '../../../../components/customButton';

const TenantAbout = () => {
  const { id } = useLocalSearchParams();
  const { state, updateTenant: updateGlobalTenant, deleteTenant: deleteGlobalTenant } = useGlobalContext();
  const [tenantDetails, setTenantDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTenantDetails = useCallback(() => {
    setIsLoading(true);
    const tenant = state.tenants.find(tenant => tenant.id === id);
    if (tenant) {
      setTenantDetails(tenant);
    } else {
      console.error("Tenant not found in local state");
    }
    setIsLoading(false);
  }, [id, state.tenants]);

  useEffect(() => {
    fetchTenantDetails();
  }, [fetchTenantDetails]);

  const removeTenant = useCallback(async () => {
    Alert.alert(
      "Confirm Tenant Removal",
      "Are you sure you want to remove this tenant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await client.graphql({
                query: deleteTenant,
                variables: {
                  input: {
                    id: tenantDetails.id,
                    _version: tenantDetails._version
                  }
                }
              });
              console.log("Deleted tenant response:", JSON.stringify(response, null, 2));
              deleteGlobalTenant(tenantDetails.id);
              console.log(state.properties)
              router.back();
            } catch (error) {
              console.error("Error deleting tenant:", error);
            }
          }
        }
      ]
    );
  }, [tenantDetails, deleteGlobalTenant]);

  const handleServiceToggle = useCallback(async (service) => {
    Alert.alert(
      "Confirm Service Update",
      `Are you sure you want to ${tenantDetails[service] ? 'disable' : 'enable'} ${service.replace('use', '')}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const newValue = !tenantDetails[service];

              setTenantDetails(prevDetails => ({
                ...prevDetails,
                [service]: newValue
              }));

              const response = await client.graphql({
                query: updateTenant,
                variables: {
                  input: {
                    id: tenantDetails.id,
                    [service]: newValue,
                    _version: tenantDetails._version
                  },
                },
              });

              if (response.data.updateTenant[service] !== newValue) {
                console.error(`Failed to update ${service}. Expected ${newValue}, but got ${response.data.updateTenant[service]}`);
                setTenantDetails(prevDetails => ({
                  ...prevDetails,
                  [service]: !newValue
                }));
              } else {
                const updatedTenant = {
                  ...tenantDetails,
                  [service]: newValue,
                  _version: response.data.updateTenant._version
                };
                updateGlobalTenant(updatedTenant);
                setTenantDetails(updatedTenant);
              }
            } catch (error) {
              console.error(`Error updating ${service}:`, error);
              setTenantDetails(prevDetails => ({
                ...prevDetails,
                [service]: !prevDetails[service]
              }));
            }
          }
        }
      ]
    );
  }, [tenantDetails, updateGlobalTenant]);

  const ServiceButton = ({ service, icon }) => (
    <Pressable
      className='items-center'
      onPress={() => handleServiceToggle(service)}
      style={{ width: '22%' }}
    >
      <View className='items-center justify-center border border-zinc-700 rounded-lg bg-tile' style={{ width: '100%', aspectRatio: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {icon}
        </View>
        <Text className='text-gray-100 font-light text-xs pb-2'>{service.replace('use', '').toLowerCase()}</Text>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-primary justify-center items-center'>
        <ActivityIndicator size="large" color="#BD6A33" />
      </SafeAreaView>
    );
  }

  if (!tenantDetails) {
    return (
      <SafeAreaView className='flex-1 bg-primary justify-center items-center'>
        <Text className='text-white text-lg'>Tenant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <Stack.Screen options={{ headerShown: false }} />

      <View className='flex-row mb-4'>
        <Pressable onPress={router.back}>
          <View className="bg-tile rounded-full p-2">
            <AntDesign name='arrowleft' color={"#c9c9c9"} size={22} />
          </View>
        </Pressable>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-secondary text-xl'>{tenantDetails.firstName} {tenantDetails.lastName}</Text>
        </View>
      </View>
      <ScrollView>
        <View className='flex flex-row justify-evenly'>
          <Image
            source={{ uri: tenantDetails.photo }}
            style={{ width: 120, height: 120, marginBottom: 16, borderRadius: 15 }}
            resizeMode='contain'
          />
          <View className='flex flex-col justify-center bg-tile rounded-lg h-[120] p-2'>
            <Text className='text-white text-xs'>{tenantDetails.phNo}</Text>
            <Text className='text-white text-md'>{tenantDetails.email}</Text>
          </View>
        </View>
        <View className='flex-col'>
          <View>
            <Text className='text-secondary text-xl'>Services</Text>
          </View>
          <View className='flex-row my-5 justify-between'>
            <ServiceButton service='useElectricity' icon={<Ionicons name='flash' size={30} color={tenantDetails.useElectricity ? "#E3EA2F" : "#424242"} />} />
            <ServiceButton service='useWater' icon={<Ionicons name='water' size={30} color={tenantDetails.useWater ? "#2FD5EA" : "#424242"} />} />
            <ServiceButton service='useInternet' icon={<Ionicons name='wifi' size={30} color={tenantDetails.useInternet ? "#5371FF" : "#424242"} />} />
            <ServiceButton service='useGas' icon={<FontAwesome5 name='fire' size={28} color={tenantDetails.useGas ? "#ECA314" : "#424242"} />} />
          </View>
        </View>
        <View className='flex-1 flex-col'>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className='w-full bg-tile items-center justify-evenly rounded flex-row p-4 mb-4'>
              <FontAwesome6 name="money-bills" size={30} color={"#4f8a41"} />
              <View className='justify-center ml-4'>
                <Text className='text-xl text-orange-400 pb-2'>The Total utility cost</Text>
                <Text className='text-3xl text-gray-300'>{'$'}{tenantDetails.costAmount}</Text>
              </View>
            </View>
          </ScrollView>
          <View className='mt-auto mb-5'>
            <Button
              title="Remove"
              className='px-5 py-1 bg-signOut border border-red-500'
              onPress={removeTenant}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TenantAbout;