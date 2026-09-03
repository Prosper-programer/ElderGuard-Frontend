import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="profile/create" />
      <Stack.Screen name="alerts/index" />
      <Stack.Screen name="alerts/[id]" />
      <Stack.Screen name="care/index" />
      <Stack.Screen name="care/new-medication" />
      <Stack.Screen name="reports/index" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
