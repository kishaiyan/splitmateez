import { FlatList, View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../../components/appBar'
import HomeTile from '../../../components/homeTile'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useGlobalContext } from '../../../context/GlobalProvider'
import { Href, Link, router } from 'expo-router'
import AddProperty from '../../list_empty'

const Home = () => {

  const ItemSeparator = () => (
    <View style={{ width: 10 }} /> // Adjust the width as needed
  );

  const linkToAddProperty = "/(property)/add" as Href;
  const { state, dispatch } = useGlobalContext();
  const { userDetails, properties, user } = state;
  const [notifyNumber, setNotifyNumber] = useState(9);
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-primary  px-4'>

      <AppBar leading={false} />
      {properties && userDetails ? (
        <>
          <View className='h-[10%] flex-row justify-between'>

            <View>
              <Text className='text-white text-xl'>Welcome back</Text>

              <Text className='text-secondary text-2xl font-extrabold'>
                {userDetails.firstName} {userDetails.lastName}
              </Text>
            </View>
            <Pressable onPress={() => { router.push("/(home)/notifications"); setNotifyNumber(0) }}>
              <View className='items-end'>
                <View className={`${notifyNumber > 0 ? "bg-red-400" : "bg-transparent"} items-center rounded-xl ${notifyNumber > 9 ? "w-4" : "w-3"}`}>
                  <Text className='text-white text-xs'>{notifyNumber > 0 ? notifyNumber > 9 ? "9+" : notifyNumber : ""}</Text>
                </View>
                <Ionicons name='notifications' color={"#ffffff"} size={24} />
              </View>
            </Pressable>
          </View>

          <View className="m-3 flex flex-row items-center">
            {visible ?
              <View className='flex-row gap-2 flex-1'>
                <MaterialIcons name='swipe' color='#ffffff' size={20} />
                <Text className='text-gray-200'>Swipe for more properties</Text>
              </View> :
              <View className='flex-1 '>
              </View>
            }
            <View>
              <Link href={linkToAddProperty}>
                <View className="flex-row bg-secondary p-3 rounded-md">
                  <Text className="text-white">Add Prop</Text>
                  <Ionicons name="add" size={20} color={"#fff"} />
                </View>
              </Link>
            </View>
          </View>

          <View className='h-[65%] items-center'>

            <FlatList
              ItemSeparatorComponent={ItemSeparator}
              showsHorizontalScrollIndicator={false}
              data={properties}
              renderItem={({ item }) => (

                <HomeTile
                  property={item}
                />

              )}
              horizontal
              ListEmptyComponent={AddProperty}

            />
          </View>
        </>) : (
        <View className='flex-1'>

        </View>
      )}
    </SafeAreaView>
  )
}

export default Home