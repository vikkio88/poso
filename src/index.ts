import { map } from "./cli/methods";
import { help } from "./cli/methods/help";

function main(argv: string[]) {
  const [method, ...args] = argv;
  const func = map[method ?? ""];

  if (!func) {
    help({ error: true });
    process.exit(1);
  }

  func(args);
}

main(process.argv.slice(2));
