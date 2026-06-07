// src/services/auth.service.ts
/*import { type AuthSessionState } from "../types/domain";
import { apiClient } from "./apiClient";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthSessionState> {
    //const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
    const response = await apiClient("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    // Guardar el token en el servicio o dejar que el componente lo maneje
    localStorage.setItem("tracesync_token", data.token);

    return {
      user: data.user,
      tenant: data.tenant,
      apps: data.apps,
    };
  },
};*/

import { type AuthSessionState } from "../types/domain";
import { apiClient } from "./apiClient";

export const AuthService = {
  async login(email: string, password: string): Promise<AuthSessionState> {
    // apiClient ya devuelve el objeto JSON con los datos (token, user, tenant, apps)
    const data = await apiClient("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // --- LOG DE AUDITORÍA: Respuesta cruda ---
    console.group("📡 [AuthService] Respuesta cruda del Backend");
    console.log("Data completa recibida:", data);
    console.log("Estructura de usuario:", data.user);
    console.log("Campo user.group detectado:", data.user?.group);
    console.log("Apps totales:", data.apps);
    console.groupEnd();
    // ------------------------------------------

    // Guardar el token en el almacenamiento local
    localStorage.setItem("tracesync_token", data.token);

    if (!data || !data.user) {
      throw new Error("Respuesta del servidor inválida: Usuario no encontrado");
    }

    return {
      user: data.user,
      tenant: data.tenant,
      apps: data.apps,
    };
  },
};
