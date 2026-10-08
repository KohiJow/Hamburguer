const expoConfig = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".expo/*", "web-build/*", "node_modules/*"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // O app nao pode ter "any": tipos estritos sao regra do projeto.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["jest.setup.js"],
    languageOptions: { globals: { jest: "readonly" } },
  },
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
