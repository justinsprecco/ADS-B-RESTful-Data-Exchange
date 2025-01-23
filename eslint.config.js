const stylisticJs = require("@stylistic/eslint-plugin-js")

module.exports = {
   plugins: {
      "@stylistic/js": stylisticJs,
   },
   rules: {
      camelcase: ["error", { properties: "always" }],
      "@stylistic/js/semi": ["error", "never"],
      "@stylistic/js/brace-style": ["error", "allman"],
      "@stylistic/js/no-tabs": "error",
      "@stylistic/js/indent": ["error", 3],
      "@stylistic/js/no-trailing-spaces": ["error"],
   },
}
