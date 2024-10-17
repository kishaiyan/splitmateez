import GlobalProvider from '../context/GlobalProvider'
import { WebSocketProvider } from '../context/webSocketProvider'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <WebSocketProvider>
      <GlobalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(tenant)" options={{ headerShown: false }} />
        </Stack>
      </GlobalProvider>
    </WebSocketProvider>
  )
}

export default RootLayout

