// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: "airbnb-typescript-prettier",
  rules: {
    "import/prefer-default-export": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "default-case": "off",
    "no-console": "error",
  }
}
