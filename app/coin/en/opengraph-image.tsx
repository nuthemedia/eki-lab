import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

export const alt = "I Ching Coin Reading — ask, toss, and read the pattern of change";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Hexagram() {
  return <div style={{ width: 190, display: "flex", flexDirection: "column", gap: 15 }}>
    {[0, 1, 2, 3, 4, 5].map((line) => <div key={line} style={{ width: "100%", height: 13, display: "flex", borderRadius: 8, background: line === 1 || line === 4 ? "linear-gradient(90deg, #0f4c45 0 43%, transparent 43% 57%, #0f4c45 57% 100%)" : "#0f4c45", boxShadow: "0 4px 9px rgba(15,76,69,.15)" }} />)}
  </div>;
}

export default async function Image() {
  const penny = await readFile(new URL("../../../public/images/coin/victorian-penny-heads.png", import.meta.url));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 76px 52px", overflow: "hidden", color: "#1f2320", background: "radial-gradient(circle at 72% 26%, #fff 0%, #f7f3ea 42%, #eee7d9 100%)", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", color: "#7b6849", fontSize: 22, letterSpacing: 5 }}>AWAI COMMONS · EKI-LAB</div><div style={{ display: "flex", padding: "10px 20px", border: "1px solid rgba(120,105,75,.3)", borderRadius: 999, color: "#0f4c45", background: "rgba(255,255,255,.6)", fontSize: 20 }}>THE THREE-COIN METHOD</div></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 690, display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 66, fontWeight: 700, letterSpacing: 1 }}>I Ching Coin Reading</div><div style={{ display: "flex", marginTop: 20, color: "#6d6a61", fontSize: 29 }}>Ask a question. Toss the coins. Read the change.</div><div style={{ display: "flex", alignItems: "center", marginTop: 35 }}><img src={penny.buffer as unknown as string} width={150} height={150} alt="" /></div></div>
        <div style={{ width: 300, height: 320, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(120,105,75,.24)", borderRadius: 34, background: "rgba(255,255,255,.56)", boxShadow: "0 24px 60px rgba(62,47,22,.09)" }}><Hexagram /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 22, borderTop: "1px solid rgba(120,105,75,.28)", color: "#6d6a61", fontSize: 22 }}><span>Primary · Changing Lines · Relating</span><span>awaicommons.com/coin/en</span></div>
    </div>, size,
  );
}
