import { Stack } from 'expo-router';

export default function KaiLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'kAI', headerLargeTitle: true }} />
    </Stack>
  );
}
