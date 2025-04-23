import stylisticJs from "@stylistic/eslint-plugin-js";

export default [
  {
    files: ["**/*.js"],
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    ignores: [
      "node_modules/**",
    ],
    rules: {
      camelcase: ["error", { properties: "always" }],
      "@stylistic/js/semi": ["error", "never"],
      "@stylistic/js/brace-style": ["error", "allman"],
      "@stylistic/js/no-tabs": "error",
      "@stylistic/js/indent": ["error", 3],
      "@stylistic/js/no-trailing-spaces": ["error"],
    },
  },
];
