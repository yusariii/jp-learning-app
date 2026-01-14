import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'user_token';
const USER_INFO_KEY = 'user_info';

const isWeb = Platform.OS === 'web';

export const saveToken = async (token: string) => {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const getToken = async () => {
  if (isWeb) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  }
};

export const saveUser = async (user: any) => {
  const jsonValue = JSON.stringify(user);
  if (isWeb) {
    localStorage.setItem(USER_INFO_KEY, jsonValue);
  } else {
    await SecureStore.setItemAsync(USER_INFO_KEY, jsonValue);
  }
};

export const getUser = async () => {
  let jsonValue;
  if (isWeb) {
    jsonValue = localStorage.getItem(USER_INFO_KEY);
  } else {
    jsonValue = await SecureStore.getItemAsync(USER_INFO_KEY);
  }
  return jsonValue != null ? JSON.parse(jsonValue) : null;
};

export const clearToken = async () => {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const clearUser = async () => {
  if (isWeb) {
    localStorage.removeItem(USER_INFO_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  }
};