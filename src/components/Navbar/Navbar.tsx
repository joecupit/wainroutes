import styles from "./Navbar.module.css";
import fonts from "@/styles/fonts.module.css";

import Link from "next/link";

import MobileNavbarButton from "./components/MobileNavbarButton";
import NavbarClient from "./NavbarClient";
import WainroutesLogo from "@/components/Logo/Logo";

import { SearchIcon, BookmarkIcon } from "@/icons/PhosphorIcons";

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
            <Link href="/walks">Walks</Link>
            <Link href="/wainwrights">Wainwrights</Link>
            <Link href="/weather">Weather</Link>
            <Link href="/about">About</Link>
            <Link href="/walks">
              <SearchIcon /> Search
            </Link>
            <Link href="/walks">
              <BookmarkIcon /> Saved
            </Link>
          </nav>

          <MobileNavbarButton />
        </div>
      </div>
    </header>
  );
}
