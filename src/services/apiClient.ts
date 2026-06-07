// src/services/apiClient.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiClient = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem("tracesync_token");
  const headers = {
    "Content-Type": "application/json",
    "bypass-tunnel-reminder": "true",
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) throw new Error("Error en la petición");
  return response.json();
};
