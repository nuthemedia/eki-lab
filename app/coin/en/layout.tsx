import "./coin-en.css";

export default function EnglishCoinLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="en">{children}</div>;
}
