import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
// @ts-ignore -- no types for this plugin
import drizzle from "eslint-plugin-drizzle";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "drizzle/schema.ts",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      drizzle,
      // @ts-ignore
      "@next/next": next,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "react/jsx-no-literals": [
        "warn",
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: [],
        },
      ],
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
