const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_BASE_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "")
  : "http://localhost:3000";
