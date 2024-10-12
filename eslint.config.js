import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
