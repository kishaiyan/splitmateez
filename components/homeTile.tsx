import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Href, router } from 'expo-router';
import { getUrl } from 'aws-amplify/storage';

const HomeTile = ({ name, maximum, current, property }) => {
  const handlePress = () => {
    router.push(`/(home)/${property.id}` as Href);
  };

  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchImageUrl = async (url) => {
    setLoading(true); // Start loading
    try {
      const result = await getUrl({ path: url });
      setPhotoUrl(result.url.toString());
    } catch (error) {
      console.log("Error fetching image URL: ", error);
      setPhotoUrl("../assets/images/home_holder.jpg"); // Optionally set to a placeholder image or keep empty
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (property.photo) {
      fetchImageUrl(property.photo);
    }
  }, [property.photo]); // Add property.photo as a dependency

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className='flex-col bg-tile p-4 h-[90%] w-[300px] rounded-3xl'>
        <View className='flex-row mb-1 h-[70%] items-center'>
          <View className='w-[100%] rounded-lg'>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Image 
                source={{ uri: photoUrl || 'path_to_placeholder_image' }} // Fallback image
                style={{ width: '100%', height: 300 }}
                resizeMode='contain'
              />
            )}
          </View>
        </View>
        <View className='flex-1 '>
          <View className='flex-row justify-around mb-5'>
            <View className='flex-col items-center'>
              <Text className='text-white'>Maximum</Text>
              <Text className='text-white'>{maximum}</Text>
            </View>
            <View className='flex-col items-center'>
              <Text className='text-white'>Current</Text>
              <Text className='text-white'>{current}</Text>
            </View>
          </View>
          <Text className='text-gray-200'>Address:</Text>
          <Text className='text-secondary'>{name}</Text>
        </View> 
      </View>
    </TouchableOpacity>
  );
}

export default HomeTile;
