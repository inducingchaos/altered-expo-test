import '@/global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { QueryProvider } from '@/features/api/provider';
import { AlteredProvider } from '@/features/altered/store';
import { AppThemeProvider } from '@/features/theme/provider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <AlteredProvider>
          <AppThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AppThemeProvider>
        </AlteredProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
