import "./hakke.css";
import SoundToggle from "@/components/hakke/SoundToggle";

export default function HakkeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hk-root">
      <div className="hk-frame">
        <SoundToggle />
        {children}
      </div>
    </div>
  );
}
