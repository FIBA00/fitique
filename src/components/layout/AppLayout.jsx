/* Lavender Lookbook application frame: always offers a quiet route home, browse, and bag across every experience. */
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import SiteFooter from "./SiteFooter";


export default function AppLayout({ children, minimal = false }) {
  return (
    <div className="page-shell">
      {!minimal && <Header />}
      <main className={minimal ? "" : "mobile-safe-bottom"}>{children}</main>
      {!minimal && <SiteFooter />} {!minimal && <MobileNavigation />}
    </div>
  );
}
