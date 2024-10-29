import { AntDesign } from "@expo/vector-icons";
import { Text, View, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const AppBar = ({ leading = false }: { leading: boolean }) => {
  const router = useRouter();
  const logo = require("../assets/images/logo.png");

  return (
    <View testID="app-bar-container" className='flex-row pt-2'>
      {leading ? (
        <Pressable testID="back-button" onPress={router.back}>
          <View className="bg-tile rounded-full p-2">
            <AntDesign name='arrowleft' color={"#c9c9c9"} size={22} />
          </View>
        </Pressable>
      ) :
        (<View className="w-7 ">

        </View>)
      }

      <View className='flex-row gap-3 mb-6 w-[90%] justify-center'>
        <Image testID="app-logo" source={logo} className='w-10 h-10' resizeMode='contain' />
        <Text testID="app-bar-title" className='text-gray-200 text-2xl font-extrabold'>SPLITSAVVY</Text>
      </View>
    </View>
  );
};

export default AppBar;
