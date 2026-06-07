// src/services/auth.service.ts

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
