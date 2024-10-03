import { AntDesign } from "@expo/vector-icons";
import { Text, View, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const AppBar = ({ leading =false }: { leading: boolean }) => {
  const router=useRouter();
  const logo = require("../assets/images/logo.png");

  return (
    <View className='flex-row items-center'>
      {leading ? (
        <Pressable className='mr-2 h-10' onPress={()=>router.back()}>
          <AntDesign name="arrowleft" size={25} color="#fff" /> 
        </Pressable>
      ):
    (<View className="w-7 ">

      </View>)
    
    }
     
      <View className='flex-row items-center gap-3 mb-6 w-[90%] justify-center'>
        <Image source={logo} className='w-10 h-10' resizeMode='contain' />
        <Text className='text-gray-200 text-2xl font-extrabold'>SPLITSAVVY</Text>
      </View>
    </View>
  );
};

export default AppBar;
