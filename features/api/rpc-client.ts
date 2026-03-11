import { createORPCClient, createSafeClient, onError } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

const RPC_URL = process.env.EXPO_PUBLIC_RPC_BASE_URL ?? 'https://example.com/rpc';

type ClientContext = {
  authToken?: string | null;
};

const link = new RPCLink<ClientContext>({
  url: RPC_URL,
  headers: ({ context }) => {
    const headers: Record<string, string> = {
      'x-client-id': 'altered-expo-mobile',
      'x-client-version': '0.1.0-prototype',
    };

    if (context.authToken) {
      headers.authorization = `Bearer ${context.authToken}`;
    }

    return headers;
  },
  interceptors: [onError((error) => console.warn('oRPC client error', error))],
});

const rawRpcClient = createORPCClient<any>(link);

export const rpcClient = createSafeClient(rawRpcClient);
export const rpcUtils = createTanstackQueryUtils(rawRpcClient);
export { RPC_URL };
