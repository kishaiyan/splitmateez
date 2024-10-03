import { Text, View, Image, ScrollView, Modal, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Href, router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import TenantCard from '../../components/tenantCard';

const PropertyDetails = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [disProperty, setdisProperty] = useState(null); // Get the property ID from the route
  const { property, setProperty } = useGlobalContext();
  const [modelVisible,setModelVisible]=useState(false);

  // Fetch the property details from some data source or state, based on the id
  useEffect(() => {
    function getProperty(id: any) {
      const selectedProperty = property.find((prop: { id: any }) => String(prop.id) === String(id));
      setdisProperty(selectedProperty);
    }
    if (id) {
      getProperty(id); // Call function if id is available
    } else {
      console.log("No Id");
    }
  }, [id, property]); // Add id and property to the dependency array

  const toggleService = (tenantId: string, service: string) => {
    // Update the displayed property (disProperty)
    setdisProperty((prevProperty: any) => {
      const updatedTenants = prevProperty.tenants.map((tenant: any) => {
        if (tenant.id === tenantId) {
          return { ...tenant, [service]: !tenant[service] };
        }
        return tenant;
      });
      return { ...prevProperty, tenants: updatedTenants };
    });

    // Update the global property state
    setProperty((prevProperties: any) => {
      const updatedProperties = prevProperties.map((prop: any) => {
        if (String(prop.id) === String(id)) {
          const updatedTenants = prop.tenants.map((tenant: any) => {
            if (tenant.id === tenantId) {
              return { ...tenant, [service]: !tenant[service] };
            }
            return tenant;
          });
          return { ...prop, tenants: updatedTenants };
        }
        return prop;
      });
      return updatedProperties;
    });
  };
  const openModel=()=>{
    
  }

  // Toggling individual services
  const toggleElectricity = (tenantId: string) => toggleService(tenantId, 'electricity');
  const toggleWater = (tenantId: string) => toggleService(tenantId, 'waterAccess');
  const toggleGas = (tenantId: string) => toggleService(tenantId, 'gas');
  const toggleWifi = (tenantId: string) => toggleService(tenantId, 'internet');
  return (
    <SafeAreaView className=' flex-1 bg-primary px-3'>
      <Stack.Screen
        options={{
          headerShown: false,
          
          
        }}
      />
        {modelVisible? <Modal />:
        (disProperty ? (
          <>
          <View className='mb-3 items-center flex-row justify-between'>
            <Pressable onPress={()=>router.back()}>
              <AntDesign name='arrowleft' size={26} color={"#fff"}/>
            </Pressable>
            <Text className='text-secondary text-xl'>{disProperty.address}</Text>
            <View className='w-10 h-3'>

            </View>
          </View>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom:10}} showsVerticalScrollIndicator={false}>

        <Image
          source={{ uri: disProperty.photo }}
          style={{ width: '100%', height: 250 }} // Use fixed height for consistent layout
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
            <Text className='text-white text-md'>{disProperty.parking_space}</Text>
          </View>
          <View className='items-center gap-1'>
            <Text className='text-secondary text-md'>Max</Text>
            <Text className='text-white text-md'>{disProperty.maximum_tenant}</Text>
          </View>
          <View className='items-center gap-1'>
            <Text className='text-secondary text-md'>Now</Text>
            <Text className='text-white text-md'>{disProperty.tenants.length}</Text>
          </View>
        </View>

        <View>
          <View className='flex-row justify-between m-2 items-center'>
            <Text className='text-white text-lg font-bold m-2'>Tenants</Text>
            <Pressable
      onPress={() => {
        router.push(`/property/add_tenant?id=${disProperty.id}&address=${disProperty.address}`);
      }}
    >

              <AntDesign name='adduser' color={"#ffffff"} size={26}/>
            </Pressable>
          </View>
          {disProperty.tenants.length > 0 ? disProperty.tenants.map((tenant: any) => (
            <TenantCard
              onPress={openModel()}
              key={tenant.id}
              tenant={tenant}
              onPressElectricity={() => toggleElectricity(tenant.id)} // Pass the tenant ID to toggle
              onPressWater={() => toggleWater(tenant.id)} // Pass the tenant ID to toggle
              onPressGas={() => toggleGas(tenant.id)} // Pass the tenant ID to toggle
              onPressWifi={() => toggleWifi(tenant.id)} // Pass the tenant ID to toggle
            />
          ))
        :<View className='items-center'>
          <Text className='text-white font-semibold'>Add Tenants to Monitor the property</Text>
          </View>}
        </View>
        
      </ScrollView>
      </>
      ) : (
        <Text className='text-white'>Loading or Property not found...</Text>
      ))}
      

    </SafeAreaView>
  );
};

export default PropertyDetails;
