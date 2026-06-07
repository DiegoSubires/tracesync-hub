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

export default function App() {
  const [session, setSession] = useState<AuthSessionState | null>(() => {
    const data = SessionService.get();
    return data;
  });

  const [activeOperator, setActiveOperator] = useState<UserSession | null>(
    null,
  );
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [screen, setScreen] = useState<
    "COMPANY_LOGIN" | "HUB" | "MODULE_OPERATOR_LOGIN"
  >("COMPANY_LOGIN");

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const allowedApps = useMemo(() => {
    if (!session?.apps || !session?.user?.group) return [];
    const userAllowedGroups = session.user.group;
    return session.apps.filter((app) => userAllowedGroups.includes(app.appId));
  }, [session?.apps, session?.user?.group]);

  const handleOperatorVerifySuccess = (operator: UserSession) => {
    setActiveOperator(operator);

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

  const handleLogout = () => {
    SessionService.clearSession();
    setSession(null);
    setActiveOperator(null);
    setScreen("COMPANY_LOGIN");
  };

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
}
