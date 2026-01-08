import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/", "coverage/"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        // Node.js globals
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",

        // Jest globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },

    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "off",
    },
  },

  js.configs.recommended,
];
