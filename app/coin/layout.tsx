import "./coin.css";
import Link from "next/link";

export default function CoinLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="coin-root">
      <div className="coin-frame">
        {children}
        <footer className="coin-footer">
          <Link href="/" aria-label="AWAI Commons トップへ">
            © 2026 AWAI Commons
          </Link>
        </footer>
      </div>
    </div>
  );
}
