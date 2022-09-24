module.exports = {
  parser: "@typescript-eslint/parser", // use typescript eslint parser
  parserOptions: {
    ecmaVersion: 2020, // Let's use es2020!
    sourceType: "module", // you are going to use npmjs.com right?
    /*
    ecmaFeatures: {
      jsx: true // React: Allow JSX
    }
    */
  },
  /*
  settings: {
    react: {
      version: "detect" // React: Detect React Version
    }
  },
  */
  extends: [
    "plugin:@typescript-eslint/recommended", // use recommended rule of @typescript-eslint/eslint-plugin
    // "plugin:react/recommended", // React: enable react plugin
    "plugin:prettier/recommended", // enable eslint
  ],
  rules: {
    // put your eslint rules here:
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "require-await": "warn",
  },
};
