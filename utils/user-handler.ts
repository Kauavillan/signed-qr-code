import * as SecureStorage from "expo-secure-store";
import { jwtDecode, JwtPayload } from "jwt-decode";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { clearRequestToken } from "../services/axios";
export interface UserDataFromStorage {
  id: string;
}

// Adds the role property to the JwtPayload interface
// This is necessary to avoid TypeScript errors when using jwt-decode
declare module "jwt-decode" {
  export interface JwtPayload {
    id: string;
  }
}
export async function getUserFromStorage(): Promise<UserDataFromStorage | null> {
  try {
    const token = await SecureStorage.getItemAsync("token");
    if (token) {
      const decoded: JwtPayload = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return { id: decoded.id! };
    }
    return null;
  } catch (error) {
    console.error("Error getting user from storage: ", error);
    return null;
  }
}

export async function deleteTokens() {
  clearRequestToken();
  await SecureStorage.deleteItemAsync("token");
}

export async function updateTokens(token: string, retries?: number) {
  try {
    await SecureStorage.setItemAsync("token", token);
  } catch (error) {
    const retriesCount = retries ?? 0;
    if (retriesCount <= 3) {
      return updateTokens(token, retriesCount + 1);
    }
  }
}

export async function getDeviceId() {
  const deviceId = await SecureStorage.getItemAsync("device_id");
  if (deviceId) return deviceId;
  return await setDeviceId();
}

async function setDeviceId() {
  const id = uuidv4();
  await SecureStorage.setItemAsync("device_id", id);
  return id;
}

export function getBearerToken() {
  return SecureStorage.getItem("token");
}
