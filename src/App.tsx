import { useState, useMemo } from "react";
import { LayoutHub } from "./components/LayoutHub/LayoutHub";
import AppRouter from "./components/AppRouter/AppRouter";
import { type AuthSessionState, type UserSession } from "./types/domain";
import { SessionService, RedirectionService } from "./services";

const DEFAULT_TENANT = {
  tenantId: "tracesync",
  businessName: "TraceSync",
  companyAddress: "Soluciones Industriales",
  logoUrl: `${import.meta.env.BASE_URL}logo.png`,
};

/*const URLS = {
  HUB: "https://tracesync.github.io/tracesync/", 
  MICROAPP: "https://tracesync.github.io/tracesync/chamberInventoryMP/" 
};*/

export default function App() {
  //console.log("🚀 [App.tsx] Renderizando App principal...");
  const [session, setSession] = useState<AuthSessionState | null>(() => {
    const data = SessionService.get();
    console.group("🔍 [DEBUG] Carga de Sesión Inicial");
    console.log("Datos recuperados de SessionService:", data);
    console.log(
      "Apps detectadas:",
      data?.apps?.map((a) => a.appId),
    );
    console.log("Grupos del usuario:", data?.user?.group);
    console.groupEnd();
    return data;
  });

  /*const [session, setSession] = useState<AuthSessionState | null>(() =>
    SessionService.get(),
  );*/

  /*const [session, setSession] = useState<AuthSessionState | null>(() => {
    const data = SessionService.get();
    // LOG: Auditoría de carga inicial
    console.group("🔍 [DEBUG] Carga de Sesión");
    console.log("Datos recuperados:", data);
    console.log(
      "Apps permitidas:",
      data?.apps?.map((a) => a.appId),
    );
    console.groupEnd();
    return data;
  });*/

  const [activeOperator, setActiveOperator] = useState<UserSession | null>(
    null,
  );
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [screen, setScreen] = useState<
    "COMPANY_LOGIN" | "HUB" | "MODULE_OPERATOR_LOGIN"
  >("COMPANY_LOGIN");

  const allowedApps = useMemo(() => {
    if (!session?.apps || !session?.user?.group) return [];

    console.group("🛡️ [App.tsx] Filtrado de Acceso");
    const userAllowedGroups = session.user.group; // Array de IDs permitidos
    console.log("Grupos permitidos para el usuario:", userAllowedGroups);

    // Filtramos las apps del tenant contra los permisos del usuario
    const filtered = session.apps.filter((app) =>
      userAllowedGroups.includes(app.appId),
    );

    console.log(
      "Apps finales tras filtro:",
      filtered.map((a) => a.appId),
    );
    console.groupEnd();

    return filtered;
  }, [session?.apps, session?.user?.group]);

  /*const handleOperatorVerifySuccess = (operator: UserSession) => {
    setActiveOperator(operator);
    // Una vez verificado, procedemos a la redirección usando el ID guardado
    if (selectedModule) {
      const app = session!.apps.find((a) => a.appId === selectedModule);
      if (app)
        RedirectionService.execute(app, operator, session!.tenant!.tenantId);
    }
  };*/

  const handleOperatorVerifySuccess = (operator: UserSession) => {
    setActiveOperator(operator);

    // CAMBIO: Buscamos en allowedApps en lugar de session.apps
    if (selectedModule) {
      const app = allowedApps.find((a) => a.appId === selectedModule);
      if (app) {
        RedirectionService.execute(app, operator, session!.tenant!.tenantId);
      } else {
        console.error(
          "Acceso denegado: El módulo seleccionado no está en las apps permitidas.",
        );
      }
    } else {
      setScreen("HUB");
    }
  };

  /*const handleLogout = () => {
    SessionService.clearSession();
    setSession(null);
    setScreen("COMPANY_LOGIN");
  };*/

  const handleLogout = () => {
    SessionService.clearSession();
    setSession(null);
    setActiveOperator(null);
    setScreen("COMPANY_LOGIN");
  };

  /*const handleGoBack = () => {
    setScreen("HUB");
    setSelectedModule(null);
  };*/

  //const currentTenant = session?.tenant || DEFAULT_TENANT;

  const handleSelectModule = (appId: string) => {
    const app = session?.apps.find((a) => a.appId === appId);
    if (!app) return;

    if (activeOperator) {
      RedirectionService.execute(
        app,
        activeOperator,
        session!.tenant!.tenantId,
      );
    } else {
      setSelectedModule(appId);
      setScreen("MODULE_OPERATOR_LOGIN");
    }
  };

  /*return (
    <LayoutHub
      onLogout={handleLogout}
      onGoBack={() => setScreen("HUB")}
      isPinScreen={screen === "MODULE_OPERATOR_LOGIN"}
      tenant={currentTenant}
      user={session?.user}
    >
      <AppRouter
        screen={screen}
        setScreen={setScreen}
        apps={session?.apps || []}
        selectedModule={selectedModule}
        onLoginSuccess={(data) => {
          setSession(data);
          setScreen("HUB");
        }}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    </LayoutHub>
  );
}*/

  /*if (!session) {
    return (
      <AppRouter
        screen="COMPANY_LOGIN"
        setScreen={setScreen}
        apps={[]}
        selectedModule={null}
        onLoginSuccess={(data) => {
          setSession(data);
          setScreen("HUB");
        }}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    );
  }

  // 2. Si HAY sesión, renderizamos el LayoutHub envolviendo al AppRouter
  return (
    <LayoutHub
      onLogout={handleLogout}
      onGoBack={() => setScreen("HUB")}
      isPinScreen={screen === "MODULE_OPERATOR_LOGIN"}
      tenant={currentTenant}
      user={session.user} // Asegúrate que session traiga el usuario aquí
    >
      <AppRouter
        screen={screen}
        setScreen={setScreen}
        apps={session.apps || []}
        selectedModule={selectedModule}
        onLoginSuccess={setSession}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    </LayoutHub>
  );*/

  if (!session) {
    return (
      <AppRouter
        screen="COMPANY_LOGIN"
        setScreen={setScreen}
        apps={[]}
        selectedModule={null}
        onLoginSuccess={(data) => {
          setSession(data);
          setScreen("HUB");
        }}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LayoutHub
      onLogout={handleLogout}
      onGoBack={() => setScreen("HUB")}
      isPinScreen={screen === "MODULE_OPERATOR_LOGIN"}
      tenant={session.tenant || DEFAULT_TENANT}
      user={session.user}
    >
      <AppRouter
        screen={screen}
        setScreen={setScreen}
        apps={allowedApps}
        selectedModule={selectedModule}
        //onLoginSuccess={setSession}
        onLoginSuccess={(data) => {
          console.log(
            "🎯 [App.tsx] onLoginSuccess recibido. Ejecutando setSession...",
          );
          setSession(data);
          setScreen("HUB");
        }}
        onSelectModule={handleSelectModule}
        onOperatorVerifySuccess={handleOperatorVerifySuccess}
        onExitModule={() => setScreen("HUB")}
        onLogout={handleLogout}
      />
    </LayoutHub>
  );
}
