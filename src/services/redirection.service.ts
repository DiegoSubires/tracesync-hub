// src/services/redirection.service.ts
import { type AppRegistry, type UserSession } from "../types/domain";

export const RedirectionService = {
  execute(app: AppRegistry, operator: UserSession, tenantId: string) {
    // 1. Codificamos los datos en Base64
    // btoa() es nativo en el navegador, no requiere instalación
    const encodedUser = btoa(encodeURIComponent(operator.name));
    const encodedTenant = btoa(encodeURIComponent(tenantId));

    // La app.url será "https://diegosubires.github.io/chamberInventoryMP/"
    const targetUrl = `${app.url}?u=${encodedUser}&t=${encodedTenant}`;

    // 3. Redirección final
    window.location.assign(targetUrl);
  },
};
