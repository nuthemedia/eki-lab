import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, "tmp", "coin-english");
const OUTPUT = path.join(ROOT, "domain", "iching", "hexagramEnglish.ts");
const MODEL = process.env.OPENAI_ICHING_INTERPRET_MODEL || "gpt-5.6-luna";

const ENGLISH_NAMES = [
  "The Creative Heaven", "The Receptive Earth", "Difficulty at the Beginning", "Youthful Folly",
  "Waiting", "Conflict", "The Army", "Holding Together", "Small Taming", "Treading", "Peace",
  "Standstill", "Fellowship", "Great Possession", "Modesty", "Enthusiasm", "Following",
  "Work on the Decayed", "Approach", "Contemplation", "Biting Through", "Grace", "Splitting Apart",
  "Return", "Innocence", "Great Taming", "Mouth Corners", "Great Preponderance", "The Abysmal Water",
  "The Clinging Fire", "Influence", "Duration", "Retreat", "Great Power", "Progress",
  "Darkening of the Light", "The Family", "Opposition", "Obstruction", "Deliverance", "Decrease",
  "Increase", "Breakthrough", "Coming to Meet", "Gathering Together", "Pushing Upward", "Oppression",
  "The Well", "Revolution", "The Cauldron", "The Arousing Thunder", "The Keeping Still Mountain",
  "Development", "The Marrying Maiden", "Abundance", "The Wanderer", "The Gentle Wind",
  "The Joyous Lake", "Dispersion", "Limitation", "Inner Truth", "Small Preponderance",
  "After Completion", "Before Completion",
];

const CHINESE_NAMES = [
  "乾", "坤", "屯", "蒙", "需", "訟", "師", "比", "小畜", "履", "泰", "否", "同人", "大有", "謙", "豫",
  "隨", "蠱", "臨", "觀", "噬嗑", "賁", "剝", "復", "无妄", "大畜", "頤", "大過", "坎", "離", "咸", "恆",
  "遯", "大壯", "晉", "明夷", "家人", "睽", "蹇", "解", "損", "益", "夬", "姤", "萃", "升", "困", "井",
  "革", "鼎", "震", "艮", "漸", "歸妹", "豐", "旅", "巽", "兌", "渙", "節", "中孚", "小過", "既濟", "未濟",
];

const PINYIN = [
  "Qián", "Kūn", "Zhūn", "Méng", "Xū", "Sòng", "Shī", "Bǐ", "Xiǎo Chù", "Lǚ", "Tài", "Pǐ",
  "Tóng Rén", "Dà Yǒu", "Qiān", "Yù", "Suí", "Gǔ", "Lín", "Guān", "Shì Kè", "Bì", "Bō", "Fù",
  "Wú Wàng", "Dà Chù", "Yí", "Dà Guò", "Kǎn", "Lí", "Xián", "Héng", "Dùn", "Dà Zhuàng", "Jìn",
  "Míng Yí", "Jiā Rén", "Kuí", "Jiǎn", "Xiè", "Sǔn", "Yì", "Guài", "Gòu", "Cuì", "Shēng", "Kùn",
  "Jǐng", "Gé", "Dǐng", "Zhèn", "Gèn", "Jiàn", "Guī Mèi", "Fēng", "Lǚ", "Xùn", "Duì", "Huàn",
  "Jié", "Zhōng Fú", "Xiǎo Guò", "Jì Jì", "Wèi Jì",
];

async function loadTsExport(file, exportName) {
  const source = await fs.readFile(path.join(ROOT, file), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const evaluatedModule = { exports: {} };
  vm.runInNewContext(js, { module: evaluatedModule, exports: evaluatedModule.exports, require() { return {}; } });
  return evaluatedModule.exports[exportName];
}

const schema = {
  type: "object", additionalProperties: false,
  properties: {
    keywords: { type: "array", minItems: 3, maxItems: 4, items: { type: "string" } },
    essence: { type: "string" }, trigramSymbolism: { type: "string" }, classical: { type: "string" }, modern: { type: "string" },
    guidance: {
      type: "object", additionalProperties: false,
      properties: { work: { type: "string" }, relationships: { type: "string" }, decision: { type: "string" } },
      required: ["work", "relationships", "decision"],
    },
    judgment: { type: "string" },
    lines: { type: "array", minItems: 6, maxItems: 6, items: { type: "string" } },
  },
  required: ["keywords", "essence", "trigramSymbolism", "classical", "modern", "guidance", "judgment", "lines"],
};

async function callOpenAI(number, texts, dictionary) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      reasoning: { effort: "none" },
      max_output_tokens: 2600,
      text: { verbosity: "low", format: { type: "json_schema", name: "hexagram_english", strict: true, schema } },
      input: [
        { role: "system", content: "You are a careful translator and editor of the Zhouyi for a general international English audience. Write fresh, plain contemporary English rather than copying any published English translation. Preserve the meaning of the supplied Classical Chinese and Japanese editorial interpretation. Avoid prediction, fatalism, exoticism, and invented doctrine. Keep judgment and each line text concise but complete; keep summaries practical and reflective. Do not use Japanese words or Japanese punctuation." },
        { role: "user", content: JSON.stringify({
          number,
          requiredOfficialEnglishName: ENGLISH_NAMES[number - 1],
          chineseName: CHINESE_NAMES[number - 1],
          pinyin: PINYIN[number - 1],
          classicalChinese: { judgment: texts.judgment.original, lines: texts.lines.map((line) => line.original) },
          japaneseEditorialDraft: { judgment: texts.judgment.modern, lines: texts.lines.map((line) => line.modern), dictionary },
          instruction: "Return only the requested English fields. Translate the Judgment and all six Line Texts into original modern English checked against the Chinese. Translate and lightly edit the dictionary content for clarity. Guidance object maps the Japanese scenes 仕事, 人間関係, 決断 to work, relationships, decision.",
        }) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`${response.status}: ${(await response.text()).slice(0, 500)}`);
  const data = await response.json();
  const output = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("");
  if (!output) throw new Error("empty response");
  return JSON.parse(output);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const texts = await loadTsExport("domain/iching/hexagramTexts.ts", "HEXAGRAM_TEXTS");
  const dictionary = await loadTsExport("domain/iching/hexagramDictionary.ts", "HEXAGRAM_DICTIONARY");
  const results = {};

  for (let start = 1; start <= 64; start += 4) {
    const numbers = Array.from({ length: Math.min(4, 65 - start) }, (_, index) => start + index);
    await Promise.all(numbers.map(async (number) => {
      const cache = path.join(CACHE_DIR, `${number}.json`);
      try {
        results[number] = JSON.parse(await fs.readFile(cache, "utf8"));
        console.log(`${number}: cached`);
        return;
      } catch {}
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const translated = await callOpenAI(number, texts[number], dictionary[number]);
          results[number] = translated;
          await fs.writeFile(cache, `${JSON.stringify(translated, null, 2)}\n`);
          console.log(`${number}: generated`);
          return;
        } catch (error) {
          console.error(`${number}: attempt ${attempt} failed: ${error.message}`);
          if (attempt === 3) throw error;
        }
      }
    }));
  }

  const entries = Object.fromEntries(Array.from({ length: 64 }, (_, index) => {
    const number = index + 1;
    const value = results[number];
    if (!value || value.lines?.length !== 6) throw new Error(`invalid hexagram ${number}`);
    return [number, {
      name: ENGLISH_NAMES[index], chineseName: CHINESE_NAMES[index], pinyin: PINYIN[index],
      keywords: value.keywords, essence: value.essence, trigramSymbolism: value.trigramSymbolism,
      classical: value.classical, modern: value.modern, guidance: value.guidance,
      judgment: { original: texts[number].judgment.original, modern: value.judgment },
      lines: texts[number].lines.map((line, lineIndex) => ({ original: line.original, modern: value.lines[lineIndex] })),
    }];
  }));
  const file = `import type { IChingText } from "./types";\n\nexport type EnglishHexagramEntry = {\n  name: string;\n  chineseName: string;\n  pinyin: string;\n  keywords: string[];\n  essence: string;\n  trigramSymbolism: string;\n  classical: string;\n  modern: string;\n  guidance: { work: string; relationships: string; decision: string };\n  judgment: IChingText;\n  lines: IChingText[];\n};\n\n/**\n * Modern English editorial translations for the coin reading.\n * Official English hexagram names follow the Unicode Yijing Hexagram names.\n * The translations are original wording checked against the Zhouyi source text and\n * the public-domain James Legge translation; they are not copied from Wilhelm–Baynes.\n */\nexport const HEXAGRAM_ENGLISH: Record<number, EnglishHexagramEntry> = ${JSON.stringify(entries, null, 2)};\n`;
  await fs.writeFile(OUTPUT, file);
  console.log(`wrote ${OUTPUT}`);
}

await main();
