import styles from "./Navbar.module.scss";
import { Logo, MonogramLogo } from "../Logo/Logo";
import { NotificationButton } from "../NotificationButton";
import { ProfileButton } from "../ProfileButton";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a className={styles.logo} href="/">
          {/* Full logo for larger screens */}
          <Logo
            height={28}
            // Small compensating margin for the descenders in the logo typeface
            style={{ marginTop: "2px" }}
            className={styles.fullLogo}
          />
          {/* Monogram logo for smaller screens */}
          <MonogramLogo height={28} className={styles.monogramLogo} />
        </a>
        {/* Navbar content can be added here */}
        <div className={styles.navTray}>
          <NotificationButton />
          <ProfileButton />
        </div>
      </div>
    </nav>
  );
}
