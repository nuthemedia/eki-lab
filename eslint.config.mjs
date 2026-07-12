import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  globalIgnores([".next/**", "node_modules/**", "out/**"]),
  nextCoreWebVitals,
  nextTypescript,
  {
    rules: {
      // マウント時 setState は SSR/ハイドレーション対策の意図的パターン(iching カード等)
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);
