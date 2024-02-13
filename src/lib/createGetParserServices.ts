import { ParserServicesWithTypeInformation } from "@typescript-eslint/utils";
import { getParserServices } from "@typescript-eslint/utils/eslint-utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

export function createGetParserServices(ctx: RuleContext<string, unknown[]>) {
  let services: ParserServicesWithTypeInformation;
  return () => {
    if (!services) {
      services = getParserServices(ctx, false);
    }
    return services;
  };
}
