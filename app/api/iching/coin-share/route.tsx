import { ImageResponse } from "next/og";
import { HEXAGRAMS_BY_NUMBER, LINE_LABELS, linesOfHexagram } from "@/domain/iching/hexagrams";
import { HEXAGRAM_DICTIONARY } from "@/domain/iching/hexagramDictionary";

export const runtime = "edge";

function OgLines({ number, changing = [] }: { number: number; changing?: number[] }) {
  const lines = linesOfHexagram(number) ?? [];
  return <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 300 }}>
    {[...lines].reverse().map((line, displayIndex) => {
      const index = 5 - displayIndex;
      return <div key={index} style={{ display: "flex", alignItems: "center", gap: 18, height: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: 260 }}>
          {line === "yang" ? <div style={{ width: 260, height: 18, background: changing.includes(index) ? "#B58A42" : "#0F4C45" }} /> : <><div style={{ width: 112, height: 18, background: changing.includes(index) ? "#B58A42" : "#0F4C45" }} /><div style={{ width: 112, height: 18, background: changing.includes(index) ? "#B58A42" : "#0F4C45" }} /></>}
        </div>{changing.includes(index) && <div style={{ color: "#B58A42", fontSize: 22 }}>変</div>}
      </div>;
    })}
  </div>;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response("invalid JSON", { status: 400 }); }
  const primaryNumber = Number(body.primaryNumber), relatingNumber = Number(body.relatingNumber);
  const primary = HEXAGRAMS_BY_NUMBER[primaryNumber];
  const relating = HEXAGRAMS_BY_NUMBER[relatingNumber] ?? null;
  const changing = Array.isArray(body.changingLineIndexes) ? body.changingLineIndexes.map(Number).filter(i => i >= 0 && i < 6) : [];
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 200) : "";
  if (!primary) return new Response("invalid payload", { status: 400 });
  const entry = HEXAGRAM_DICTIONARY[primaryNumber];
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F7F3EA", color: "#1F2320", padding: "92px 76px", fontFamily: "sans-serif", border: "8px solid #B58A42" }}>
    <div style={{ display: "flex", justifyContent: "space-between", color: "#6D6A61", fontSize: 26, letterSpacing: 5 }}><span>コイン易占い</span><span>eki-lab</span></div>
    {question && <div style={{ display: "flex", flexDirection: "column", marginTop: 72, padding: 30, border: "2px solid rgba(120,105,75,.22)", borderRadius: 24, background: "rgba(255,255,255,.52)" }}><span style={{ color: "#B58A42", fontSize: 22 }}>問い</span><span style={{ fontSize: 38, lineHeight: 1.5, marginTop: 12 }}>{question}</span></div>}
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-around", marginTop: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}><span style={{ color: "#6D6A61", fontSize: 24 }}>本卦　第{primary.number}卦</span><span style={{ fontSize: 62, fontWeight: 700 }}>{primary.name}</span><OgLines number={primary.number} changing={changing} /></div>
      {relating && <><span style={{ color: "#B58A42", fontSize: 52 }}>→</span><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}><span style={{ color: "#6D6A61", fontSize: 24 }}>之卦　第{relating.number}卦</span><span style={{ fontSize: 62, fontWeight: 700 }}>{relating.name}</span><OgLines number={relating.number} /></div></>}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 24, borderTop: "2px solid rgba(120,105,75,.22)", paddingTop: 40 }}><div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>{entry.keywords.map(word => <span key={word} style={{ padding: "10px 22px", border: "2px solid rgba(181,138,66,.5)", borderRadius: 99, fontSize: 26 }}>{word}</span>)}</div><span style={{ fontSize: 38, lineHeight: 1.55 }}>{entry.essence}</span><span style={{ color: "#6D6A61", fontSize: 24 }}>{changing.length ? `変爻：${changing.map(i => LINE_LABELS[i]).join("・")}` : "変爻なし・之卦なし"}</span></div>
  </div>, { width: 1080, height: 1350 });
}
