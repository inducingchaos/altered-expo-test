import { Stack } from 'expo-router';

export default function BrainLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'ALTERED', headerLargeTitle: true }} />
    </Stack>
  );
}
