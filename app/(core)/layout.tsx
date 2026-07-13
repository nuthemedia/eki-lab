import "./iching.css";

export default function IchingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="ik-root">
      <div className="ik-frame">{children}</div>
    </div>
  );
}
