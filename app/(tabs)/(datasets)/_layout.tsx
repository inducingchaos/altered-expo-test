import { Stack } from 'expo-router';

export default function DatasetsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Datasets', headerLargeTitle: true }} />
    </Stack>
  );
}
