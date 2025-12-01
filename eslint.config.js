import js from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/", "coverage/"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
      "no-console": "off"
    },
  },
  js.configs.recommended,
];
