// src/services/operator.service.ts

import { type UserSession } from "../types/domain";
import { apiClient } from "./apiClient";

export const OperatorService = {
  async verifyOperatorPin(appId: string, pin: string): Promise<UserSession> {
    if (!appId) throw new Error("ID de aplicación no definido");
    if (!pin || pin.length === 0) throw new Error("PIN no proporcionado");

    const token = localStorage.getItem("tracesync_token");

    // Almacenamos el resultado directo en 'data'
    const data = await apiClient("/api/operators/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appId, pin }),
    });

    return data;
    console.log(data);
  },
};
