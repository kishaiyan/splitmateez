import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Href, router } from 'expo-router';

const HomeTile = ({ property }) => {

  const handlePress = () => {
    router.push(`/(home)/${property.id}` as Href);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className='flex-col bg-tile p-4 h-[90%] w-[300px] rounded-3xl'>
        <View className='flex-row mb-1 h-[70%] items-center'>
          <View className='w-[100%] rounded-lg'>
            <Image
              source={{ uri: property.photo }} // Fallback image
              style={{ width: '100%', height: 300 }}
              resizeMode='contain'
            />

          </View>
        </View>
        <View className='flex-1 '>
          <View className='flex-row justify-around mb-5'>
            <View className='flex-col items-center'>
              <Text className='text-white'>Maximum</Text>
              <Text className='text-white'>{property.maximum}</Text>
            </View>
            <View className='flex-col items-center'>
              <Text className='text-white'>Current</Text>
              <Text className='text-white'>{property.tenants ? property.tenants.length : 0}</Text>
            </View>
          </View>
          <Text className='text-gray-200'>Address:</Text>
          <Text className='text-secondary'>{property.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default HomeTile;
