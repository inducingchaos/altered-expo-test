import { Stack } from 'expo-router';

export default function ObjectiveLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Clarify Objective', headerLargeTitle: true }} />
    </Stack>
  );
}
