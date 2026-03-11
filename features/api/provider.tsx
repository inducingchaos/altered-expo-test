import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { createQueryClient } from './query-client';

export function QueryProvider({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(() => createQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
