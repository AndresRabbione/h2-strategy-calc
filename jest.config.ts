/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/src/$1"],
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};

export default config;
