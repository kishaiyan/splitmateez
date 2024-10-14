import { FlatList, View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppBar from '../../../components/appBar'
import HomeTile from '../../../components/homeTile'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useGlobalContext } from '../../../context/GlobalProvider'
import LoadingScreen from '../../loadingScreen'
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
  const costs = [
    {
      propertyId: "fe9e1590-5be2-4050-8fa1-6d43ae8ab5f0",
      tenant_cost: {

        "b9bef4f8-7061-7075-2b14-30381a1f0039": 1234,

        "f9ceb498-5031-7095-4ab5-10598bbf77e4": 3456,

        "390e2418-10b1-7016-9cf8-53d25a0af565": 4567

      }
    }
  ]
  const cost = {
    "property_costs": {
      "fe9e1590-5be2-4050-8fa1-6d43ae8ab5f0": {
        "b9bef4f8-7061-7075-2b14-30381a1f0039": 14400
      }
    }
  }

  const initiateSocketConnection = () => {
    const ws = new WebSocket('wss://x93f2f8a41.execute-api.ap-southeast-2.amazonaws.com/production/');
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          userId: user,
        })
      )
    }

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data)
    }
    costs.forEach((cost) => {
      console.log(cost.propertyId)
      const prop = properties.find((property) => cost.propertyId === property.id);

      prop.tenants.forEach((tenant) => {
        if (tenant.id in cost.tenant_cost) {
          tenant.costAmount = cost.tenant_cost[tenant.id];
        }
      })
    })
  }
  useEffect(() => {
    initiateSocketConnection()
  }, [])

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
            <Pressable onPress={() => { router.push("/notifications"); setNotifyNumber(0) }}>
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
        </>) : (<View className='flex-1 items-center justify-center'>
          <LoadingScreen />

        </View>)}
    </SafeAreaView>
  )
}

export default Home