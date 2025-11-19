import minimist from "minimist";
import { c } from "../libs/colours";

export type ParsedArgs = {
  args: string[];
  flags: Record<string, string | boolean>;
};

export function argsParser(
  argv: string[],
  allowedFlags: string[] = [],
): ParsedArgs {
  const parsed = minimist(argv);

  const args = parsed._;
  const flags: Record<string, string | boolean> = {};

  Object.keys(parsed).forEach((key) => {
    if (key === "_") return;

    if (!allowedFlags.includes(key)) {
      console.error(
        `${c.red("Unknown flag:")} ${c.b(key)}
        ${
          allowedFlags.length
            ? `Allowed flags: ${allowedFlags.map((f) => c.b(f)).join(", ")}`
            : ""
        }`,
      );
      process.exit(1);
    }

    flags[key] = parsed[key];
  });

  return { args, flags };
}
