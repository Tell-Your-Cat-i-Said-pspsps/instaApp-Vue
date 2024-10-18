/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting"
    // "plugin:prettier/recommended"
  ],
  overrides: [
    {
      files: [
        "cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}",
        "cypress/support/**/*.{js,ts,jsx,tsx}"
      ],
      extends: ["plugin:cypress/recommended"]
    }
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "never"
      }
    ],
    indent: ["error", 2],
    "vue/script-indent": ["error", 2],
    "vue/multiline-html-element-content-newline": 0,
    "vue/multi-word-component-names": 0,
    "vue/html-indent": [
      "error",
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
        ignores: ["pre", "textarea", "span"]
      }
    ],
    "vue/html-quotes": ["error", "double", { avoidEscape: false }]
    // "vue/max-attributes-per-line": [
    //   "error",
    //   {
    //     singleline: {
    //       max: 1
    //     },
    //     multiline: {
    //       max: 1
    //     }
    //   }
    // ]
  }
};
