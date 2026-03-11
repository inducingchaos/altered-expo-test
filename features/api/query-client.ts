import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient } from '@tanstack/react-query';

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(Boolean(state.isConnected));
  });
});

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 30,
        retry: 2,
      },
    },
  });
}
