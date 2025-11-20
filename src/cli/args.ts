import minimist from "minimist";

export function argsParser<const Allowed extends readonly string[]>(
  argv: string[],
  allowedFlags: Allowed = [] as unknown as Allowed,
): {
  args: string[];
  flags: Record<Allowed[number], string | boolean>;
} {
  const parsed = minimist(argv);

  const args = parsed._ as string[];

  const flags = {} as Record<Allowed[number], string | boolean>;

  Object.keys(parsed).forEach((key) => {
    if (key === "_") return;

    if (!allowedFlags.includes(key as Allowed[number])) {
      console.error(
        `Unknown flag: ${key}. Allowed flags: ${allowedFlags.join(", ")}`,
      );
      process.exit(1);
    }

    flags[key as Allowed[number]] = parsed[key];
  });

  return { args, flags };
}
