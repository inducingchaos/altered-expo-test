import { Stack } from 'expo-router';

export default function SystemsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Systems', headerLargeTitle: true }} />
    </Stack>
  );
}
