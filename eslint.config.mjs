import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** 
 * @type {import('eslint').Linter.Config[]} 
 * ESLint configuration array that applies rules and settings across various file types
 */
export default [
  // Apply to all JavaScript and TypeScript files (including .js, .mjs, .cjs, .ts)
  { 
    files: ["**/*.{js,mjs,cjs,ts}"] 
  },

  // Define the environment and globals for browser-based projects
  { 
    languageOptions: { 
      globals: globals.browser  // Use browser-specific global variables
    } 
  },

  // Custom ESLint rules for code quality and best practices
  {
    rules: {
      // Warn when console statements are used, but allow 'warn' and 'error'
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Enforce semicolons at the end of statements for consistency and clarity
      "semi": ["error", "always"],

      // Ensure Unix-style line breaks for cross-platform compatibility
      "linebreak-style": ["error", "unix"],

      // Warn about unused variables to keep the code clean and prevent errors
      "no-unused-vars": "warn",

      // Limit the number of lines in a file to 200 to encourage modularization
      "max-lines": ["warn", 200],

      // Prevent the use of 'eval()' due to security concerns and potential issues
      "no-eval": "error",

      // Disable the TypeScript rule that requires explicit return types for functions
      "@typescript-eslint/explicit-module-boundary-types": "off"  // Disable specific TypeScript rule
    }
  },

  // Extend recommended JavaScript ESLint rules (provided by @eslint/js plugin)
  pluginJs.configs.recommended,

  // Extend recommended TypeScript ESLint rules (provided by @typescript-eslint plugin)
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    rules: {
      ...config.rules,
      "@typescript-eslint/no-explicit-any": "off"
    }
  })),];
