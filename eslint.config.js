const sheriff = require("eslint-config-sheriff");
const { defineFlatConfig } = require("eslint-define-config");
const eslintPluginAll = require("eslint-plugin-eslint-plugin/configs/all");

const sheriffOptions = {
  react: false,
  lodash: false,
  next: false,
  playwright: false,
  jest: false,
  vitest: true,
};

module.exports = defineFlatConfig([
  ...sheriff(sheriffOptions),
  eslintPluginAll,
]);
