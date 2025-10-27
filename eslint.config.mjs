// eslint.config.mjs
import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier"; // 👈 important

export default defineConfig([
  ...next,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
    plugins: { prettier: prettierPlugin }, // 👈 ajoute le plugin ici
    rules: {
      // 💅 Active Prettier comme formateur
      "prettier/prettier": "warn",

      // 🔒 Recommandations utiles pour React / Next.js
      "react/jsx-key": "warn",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off",
    },
  },
  prettier,
]);
