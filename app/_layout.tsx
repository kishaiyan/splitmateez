import GlobalProvider from '../context/GlobalProvider'
import { Stack } from 'expo-router'
const RootLayout = () => {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="(auth)" options={{headerShown:false}} />
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        <Stack.Screen name="modal"  options={{presentation:'modal'}}/>
      </Stack>
    </GlobalProvider>
 
  )
}

export default RootLayout

 