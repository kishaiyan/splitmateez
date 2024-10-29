import { Text, View, Image, ScrollView, Modal, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Href, router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import client from '../../../lib/client';
import { deleteProperty } from '../../../src/graphql/mutations';
import TenantCard from '../../../components/tenantCard';
import Button from '../../../components/customButton';

const PropertyDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, deleteProperty: deleteGlobalProperty } = useGlobalContext();
  const { properties } = state;
  const [disProperty, setDisProperty] = useState(null);

  const removeProperty = async () => {
    try {
      const response = await client.graphql({
        query: deleteProperty,
        variables: {
          input: {
            id: disProperty.id,
            _version: disProperty._version
          },
        }
      });
      console.log(response)
      if (response.data.deleteProperty) {
        console.log("Property successfully removed");
        await deleteGlobalProperty(disProperty.id);
        router.back();
      } else {
        console.log("Property removal failed");
      }
    } catch (error) {
      console.error("Error removing property:", JSON.stringify(error, null, 2));
    }
  }

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

  useEffect(() => {
    if (disProperty) {
      const updatedProperty = properties.find((prop) => prop.id === disProperty.id);
      setDisProperty(updatedProperty);
    }
  }, [properties, disProperty]);

  return (
    <SafeAreaView className='flex-1 bg-primary px-3 pb-6'>
      <Stack.Screen options={{ headerShown: false }} />
      {disProperty ? (
        <>
          <View className='mb-3 items-center flex-row justify-between pt-2'>
            <Pressable onPress={router.back}>
              <View className="bg-tile rounded-full p-2">
                <AntDesign name='arrowleft' color={"#c9c9c9"} size={22} />
              </View>
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
                <Text className='text-white text-md'>{disProperty.tenants ? disProperty.tenants.length : 0}</Text>
              </View>
            </View>

            <View>
              <View className='flex-row justify-between m-2 items-center'>
                <Text className='text-white text-lg font-bold m-2'>Tenants</Text>
                <Pressable onPress={() => router.push(`/(property)/add_tenant?id=${disProperty.id}&address=${disProperty.address}` as Href)}>
                  <AntDesign name='adduser' color={"#ffffff"} size={26} />
                </Pressable>
              </View>
              {disProperty.tenants && disProperty.tenants.length > 0 ? (
                disProperty.tenants.map((tenant) => (
                  <TenantCard
                    onPress={() => router.push({
                      pathname: `/(property)/(tenant)/${tenant.id}`,
                    } as Href)}
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
