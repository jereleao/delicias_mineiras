/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-sort-json"],
  trailingComma: "all",
  tailwindAttributes: ["theme"],
  tailwindFunctions: ["twMerge"],
  useTabs: false,
  tabWidth: 2,
  singleQuote: false,
  endOfLine: "auto",
};
