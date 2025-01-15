import path from "path";
import { ESLint } from "eslint";
import { describe, beforeAll, test, expect } from "vitest";

describe("ESLint config fixture test", () => {
  let eslint: ESLint;

  beforeAll(() => {
    eslint = new ESLint({
      overrideConfigFile: path.resolve(__dirname, "./fixtures/eslint.config.mjs"),
    });
  });

  test("valid config", async () => {
    const results = await eslint.lintFiles([path.resolve(__dirname, "./fixtures/valid.tsx")]);

    const [result] = results;
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBe(0);
  });
});
