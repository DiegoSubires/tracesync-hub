/*import { type AppRegistry, type UserSession } from "../types/domain";

export const RedirectionService = {
  execute(app: AppRegistry, operator: UserSession, tenantId: string) {
    const maxAge = 8 * 60 * 60;
    const secureFlag =
      window.location.hostname !== "localhost" ? "Secure;" : "";

    document.cookie = `auth_operator=${encodeURIComponent(operator.name)}; max-age=${maxAge}; path=/; SameSite=Lax; ${secureFlag}`;
    document.cookie = `auth_tenant=${encodeURIComponent(tenantId)}; max-age=${maxAge}; path=/; SameSite=Lax; ${secureFlag}`;

    window.location.assign(app.url);
  },
};*/

// src/services/redirection.service.ts
import { type AppRegistry, type UserSession } from "../types/domain";

export const RedirectionService = {
  execute(app: AppRegistry, operator: UserSession, tenantId: string) {
    // 1. Codificamos los datos en Base64
    // btoa() es nativo en el navegador, no requiere instalación
    const encodedUser = btoa(encodeURIComponent(operator.name));
    const encodedTenant = btoa(encodeURIComponent(tenantId));

    // 2. Construimos la URL de la microapp independiente
    // La app.url será "https://diegosubires.github.io/chamberInventoryMP/"
    const targetUrl = `${app.url}?u=${encodedUser}&t=${encodedTenant}`;

    // 3. Redirección final
    window.location.assign(targetUrl);
  },
};
