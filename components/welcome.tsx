
import AppBar from "./appBar";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Redirect } from "expo-router";
import Button from "./customButton";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const icon = require('../assets/images/splash_screen.jpg')
  const { state, dispatch } = useGlobalContext();
  const { isLoading, userType, isLoggedIn } = state;

  if (!isLoading && isLoggedIn && userType == "owner") {
    return <Redirect href="/(home)" />
  }

  else if (!isLoading && isLoggedIn && userType != "owner") {
    return <Redirect href="/(tenant)" />
  }
  return (
    <SafeAreaView className="flex-1 items-center bg-primary">

      <AppBar leading={false} />

      <View className="realtive mt-8 h-full w-full">
        <Image
          source={icon}
          className="w-screen h-screen"
        />
        <View className="absolute bg-black/80  items-center justify-evenly w-full h-[30%] bottom-[5%] " style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, }} >
          <Button
            title="Get Started !"
            handlePress={() =>
              router.push('/signIn')}
            containerStyle="w-[70%] min-h-[62px]"
            textStyle="text-white"
          />
          <View className=" h-[10%]"></View>


        </View>
      </View>

    </SafeAreaView>
  )
}

export default Welcome;