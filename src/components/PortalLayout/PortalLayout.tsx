import React from "react";
import { SessionService } from "../../services/session.service";
import styles from "./portal-layout.module.scss";

interface PortalLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

export default function PortalLayout({
  onLogout,
  children,
}: PortalLayoutProps) {
  const session = SessionService.get();
  const { tenant, user } = session ?? { tenant: null, user: null };

  // Normalización del logo (detecta si es Base64 o URL)
  const logoSrc = SessionService.getLogo(tenant);

  return (
    <div className={styles.portalWrapper}>
      <header className={styles.headerBar}>
        <div className={styles.headerContainer}>
          <div className={styles.leftSection}>
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className={styles.logoImage} />
            ) : (
              <div className={styles.fallbackLogo}>TS</div>
            )}

            <div className={styles.brandMeta}>
              <span className={styles.companyName}>
                {tenant?.businessName || "TraceSync"}
              </span>
              <span className={styles.pageLabel}>Portal de Operaciones</span>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.operatorInfo}>
              <span className={styles.operatorName}>
                {user?.name || "Invitado"}
              </span>
              <span className={styles.operatorRole}>
                {user?.role || "Acreditado"}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className={styles.logoutButton}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>{children}</main>

      {/* Ajustado a la clase .footer definida en SASS */}
      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <span>{tenant?.businessName}</span>
          <span>{tenant?.companyAddress}</span>
        </div>
      </footer>
    </div>
  );
}
