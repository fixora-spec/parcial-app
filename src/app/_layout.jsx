import { Stack } from 'expo-router';
import { AlarmasProvider } from '../context/AlarmasContext';

export default function RootLayout() {
  return (
    <AlarmasProvider>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="reloj" />
        <Stack.Screen name="alarmas" />
        <Stack.Screen name="cronometro" />
      </Stack>
    </AlarmasProvider>
  );
}