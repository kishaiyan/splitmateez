import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../../lib/client';
import { updateTenant, deleteTenant } from '../../../src/graphql/mutations';
import { getTenant } from '../../../src/graphql/queries';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import Button from '../../../components/customButton';

const TenantAbout = () => {
  const { id } = useLocalSearchParams();
  const { state, updateTenant: updateGlobalTenant, deleteTenant: deleteGlobalTenant } = useGlobalContext();
  const [tenantDetails, setTenantDetails] = useState(null);

  const fetchTenantDetails = useCallback(() => {
    const tenant = state.tenants.find(tenant => tenant.id === id);
    if (tenant) {
      setTenantDetails(tenant);
    } else {
      console.error("Tenant not found in local state");
    }
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
              console.log(response.data.updateTenant);
              if (response.data.updateTenant[service] !== newValue) {
                console.error(`Failed to update ${service}. Expected ${newValue}, but got ${response.data.updateTenant[service]}`);
              } else {
                const updatedTenant = {
                  ...tenantDetails,
                  [service]: newValue,
                  _version: response.data.updateTenant._version
                };
                updateGlobalTenant(updatedTenant);
                fetchTenantDetails();  // Fetch updated tenant details
              }
            } catch (error) {
              console.error(`Error updating ${service}:`, error);
            }
          }
        }
      ]
    );
  }, [tenantDetails, updateGlobalTenant, fetchTenantDetails]);

  const ServiceButton = ({ service, icon }) => (
    <Pressable className='items-center' onPress={() => handleServiceToggle(service)}>
      {icon}
      <Text className='text-gray-100 font-light text-xs'>{service.replace('use', '').toLowerCase()}</Text>
    </Pressable>
  );

  if (!tenantDetails) {
    return <Text className='text-white'>Loading or Tenant not found...</Text>;
  }

  return (
    <SafeAreaView className='flex-1 bg-primary px-4'>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Pressable className='mr-2 h-10' onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={25} color="#fff" />
        </Pressable>
      </View>
      <View className='items-center'>
        <Image
          source={{ uri: tenantDetails.photo }}
          style={{ width: 200, height: 200, marginBottom: 16, borderRadius: 15 }}
          resizeMode='contain'
        />
      </View>
      <Text className='text-white text-xl'>{tenantDetails.firstName} {tenantDetails.lastName}</Text>
      <Text className='text-white text-xs'>{tenantDetails.phNo}</Text>
      <Text className='text-white text-md'>{tenantDetails.email}</Text>

      <View className='items-center justify-evenly flex-row my-5'>
        <ServiceButton service='useElectricity' icon={<Ionicons name='flash' size={35} color={tenantDetails.useElectricity ? "#BD6A33" : "#424242"} />} />
        <ServiceButton service='useWater' icon={<Ionicons name='water' size={35} color={tenantDetails.useWater ? "#BD6A33" : "#424242"} />} />
        <ServiceButton service='useInternet' icon={<Ionicons name='wifi' size={35} color={tenantDetails.useInternet ? "#BD6A33" : "#424242"} />} />
        <ServiceButton service='useGas' icon={<FontAwesome5 name='fire' size={32} color={tenantDetails.useGas ? "#BD6A33" : "#424242"} />} />
      </View>
      <View>
        <View className='w-full h-[50%] bg-tile items-center justify-evenly rounded flex-row'>
          <FontAwesome6 name="money-bills" size={30} color={"#4f8a41"} />
          <View className='h-[90%] justify-center'>
            <Text className='text-xl text-orange-400 pb-2'>The Total utility cost</Text>
            <Text className='text-3xl text-gray-300'>{'$'}{tenantDetails.costAmount}</Text>
          </View>
        </View>
        <View className='items-center'>
          <Button
            title="Remove"
            className='px-5 py-1 bg-signOut border border-red-500 mt-5'
            onPress={removeTenant}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TenantAbout;