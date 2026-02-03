import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  {
    ignores: [".next/", "node_modules/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React recommended rules
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in Next.js/React 17+
      "react/prop-types": "off", // Not needed with TypeScript

      // React Hooks recommended rules
      ...hooksPlugin.configs.recommended.rules,

      // Next.js recommended rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Custom adjustments
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  }
);
