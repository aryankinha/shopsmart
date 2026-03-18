module.exports = {
  env: { node: true, es2021: true, commonjs: true },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error"
  }
};
