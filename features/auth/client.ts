import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

const AUTH_URL = process.env.EXPO_PUBLIC_AUTH_BASE_URL ?? 'https://example.com';
const TOKEN_KEY = 'altered-auth-token';

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
});

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export { AUTH_URL };
