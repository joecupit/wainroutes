import styles from "./Navbar.module.css";
import fonts from "@/styles/fonts.module.css";

import Link from "next/link";

import MobileNavbarButton from "./components/MobileNavbarButton";
import NavbarClient from "./NavbarClient";
import WainroutesLogo from "@/components/Logo/Logo";

import { BookmarkIcon } from "@/icons/PhosphorIcons";
import NavSearch from "./components/NavSearch";

const navbarId = "navbar";

export default async function Navbar() {
  return (
    <header id={navbarId} className={`${styles.navbar}`}>
      <NavbarClient targetId={navbarId} />

      <div className={styles.main}>
        <div className={styles.mainLeft}>
          <Link href="/" className={styles.logo}>
            <WainroutesLogo /> Wainroutes
          </Link>
        </div>

        <div className={styles.mainRight}>
          <nav id="navbar-nav" className={styles.nav}>
            <Link className={styles.navItem} href="/walks">
              Walks
            </Link>
            <Link className={styles.navItem} href="/wainwrights">
              Wainwrights
            </Link>
            <Link className={styles.navItem} href="/weather">
              Weather
            </Link>
            <Link className={styles.navItem} href="/about">
              About
            </Link>
            <NavSearch />
            <Link title="Saved routes" className={styles.navItem} href="/walks">
              <BookmarkIcon />
            </Link>
          </nav>

          <MobileNavbarButton />
        </div>
      </div>
    </header>
  );
}
