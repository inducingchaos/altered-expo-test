import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { API_URL, apiFetch } from '@/features/api/http-client';
import { AUTH_URL, clearAuthToken, getAuthToken, saveAuthToken } from '@/features/auth/client';
import { RPC_URL, rpcUtils } from '@/features/api/rpc-client';

const tokenSchema = z.object({
  token: z.string().min(8, 'Token should be at least 8 chars for this demo.'),
});

type TokenForm = z.infer<typeof tokenSchema>;

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export function MobileStackShowcase() {
  const [storedToken, setStoredToken] = React.useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['demo-todo'],
    queryFn: () => apiFetch<Todo>('/todos/1'),
  });

  const authMutation = useMutation({
    mutationFn: async (token: string) => {
      await saveAuthToken(token);
      return getAuthToken();
    },
    onSuccess: (token) => {
      setStoredToken(token);
      Alert.alert('Token saved', 'SecureStore + Better Auth client scaffold is wired.');
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await clearAuthToken();
      return getAuthToken();
    },
    onSuccess: (token) => setStoredToken(token),
  });

  const form = useForm<TokenForm>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: '',
    },
  });

  React.useEffect(() => {
    void getAuthToken().then(setStoredToken);
  }, []);

  return (
    <View style={{ gap: 10, borderWidth: 2, borderColor: '#111111', borderRadius: 18, padding: 14 }}>
      <Text selectable style={{ fontSize: 13, fontWeight: '800', letterSpacing: 0.7 }}>
        STACK SHOWCASE: QUERY + ORPC + AUTH
      </Text>

      <Text selectable style={{ fontSize: 12, color: '#555555' }}>
        React Query API base: {API_URL}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={() => void refetch()}
          style={{ borderWidth: 1.5, borderColor: '#111111', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}
        >
          <Text selectable style={{ fontWeight: '700', fontSize: 12 }}>
            Refetch query
          </Text>
        </Pressable>
        {(isLoading || isFetching) && <ActivityIndicator size="small" color="#111111" />}
      </View>

      {data ? (
        <Text selectable style={{ fontSize: 12, color: '#222222' }}>
          Todo: #{data.id} {data.title} ({data.completed ? 'done' : 'open'})
        </Text>
      ) : null}

      <Text selectable style={{ fontSize: 12, color: '#555555' }}>
        oRPC endpoint: {RPC_URL}
      </Text>
      <Text selectable style={{ fontSize: 11, color: '#555555' }}>
        oRPC root query key: {JSON.stringify(rpcUtils.key({ type: 'query' }))}
      </Text>

      <Text selectable style={{ fontSize: 12, color: '#555555' }}>
        Better Auth base URL: {AUTH_URL}
      </Text>
      <TextInput
        value={form.watch('token')}
        onChangeText={(value) => form.setValue('token', value, { shouldValidate: true })}
        placeholder="demo bearer token"
        autoCapitalize="none"
        style={{
          borderWidth: 1.5,
          borderColor: '#111111',
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: '#FFFFFF',
        }}
      />
      {form.formState.errors.token ? (
        <Text selectable style={{ color: '#B00020', fontSize: 12 }}>
          {form.formState.errors.token.message}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={() => {
            const result = tokenSchema.safeParse({ token: form.getValues('token') });
            if (!result.success) {
              form.setError('token', { message: result.error.issues[0]?.message ?? 'Invalid token' });
              return;
            }

            authMutation.mutate(result.data.token);
          }}
          style={{
            borderWidth: 1.5,
            borderColor: '#111111',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: '#111111',
          }}
        >
          <Text selectable style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
            Save token
          </Text>
        </Pressable>

        <Pressable
          onPress={() => clearMutation.mutate()}
          style={{ borderWidth: 1.5, borderColor: '#111111', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}
        >
          <Text selectable style={{ fontWeight: '700', fontSize: 12 }}>
            Clear token
          </Text>
        </Pressable>
      </View>

      <Text selectable style={{ fontSize: 12, color: '#555555' }}>
        Stored token: {storedToken ?? 'none'}
      </Text>
    </View>
  );
}
