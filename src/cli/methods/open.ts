import fs from "node:fs";
import { createInterface } from "node:readline/promises";
import { APP_BIN } from "../../config";
import { parseFile } from "../../http/file";
import { c } from "../../libs/colours";
import { parseVariables } from "../../libs/variables";
import { build } from "../../rest/builder";
import type { RestRequest } from "../../rest/types";
import { argsParser } from "../args";
import { requestRunner, runnerFlags } from "../shared/reqRunner";

export async function open(argv: string[]) {
  const { args, flags } = argsParser(argv, [
    ...runnerFlags,
    "list",
    "request-name",
    "silent",
  ] as const);
  const [filePath, additionalVariablesStr] = args;

  const additionalVariables = parseVariables(additionalVariablesStr);
  if (!filePath) {
    console.error(
      `${c.red("Missing parameter:")} ${c.b("file path")} ${c.red(
        `\nUsage: ${APP_BIN} open <path/to/file>`,
      )}`,
    );
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`${c.red("File not found:")} ${c.b(filePath)}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw) {
    console.error(`${c.red("Empty file:")} ${c.b(filePath)}`);
    process.exit(1);
  }

  const parsed = parseFile(raw, additionalVariables);
  const reqs = parsed.requests;

  if (parsed.length === 0) {
    console.error(`${c.red("No requests in file:")} ${c.b(filePath)}`);
    process.exit(1);
  }

  if (flags.list) {
    list(reqs);
    process.exit();
  }

  let req: RestRequest | undefined;

  if (parsed.length === 1 && !flags["request-name"]) {
    if (!flags.silent)
      console.log(
        `\nFile ${c.b(filePath)} has only 1 request, executing it...\n`,
      );
    req = Object.values(reqs)[0]!;
  }
  const reqName = flags["request-name"];
  if (reqName || Number(reqName) === 0) {
    const name = String(flags["request-name"]);
    req = reqs[name];
    if (!req) {
      console.error(
        `${c.red(`Missing request ${name} in file:`)} ${c.b(filePath)}`,
      );
      list(reqs);
      process.exit(1);
    }
  }

  if (!req) {
    console.log(reqs);
    req = await chooseRequest(reqs);
  }

  await exec(req, flags, filePath);
  process.exit(0);
}

async function exec(
  req: RestRequest,
  flags: Record<string, string | boolean>,
  filePath: string,
) {
  const built = build(req);
  if (!built) {
    console.error(`${c.red("Invalid request syntax:")} ${c.b(filePath)}`);
    process.exit(1);
  }
  await requestRunner(req, built, flags);
}

function list(reqs: Record<string, RestRequest>) {
  const names = Object.keys(reqs)
    .map((name) => {
      const r = reqs[name];
      return `- ${name}\n\t${c.blue(r?.method)} ${c.green(r?.url)}`;
    })
    .join("\n");
  console.log(`${c.b("Requests:")}\n${names}`);
}

const EXIT_STRINGS = [":quit", ":q"] as const;

async function chooseRequest(
  reqs: Record<string, RestRequest>,
): Promise<RestRequest> {
  let req: RestRequest | undefined;

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (!req) {
    console.log("Choose between:");
    list(reqs);
    console.log(`\n${c.b(EXIT_STRINGS[1])} to quit.\n`);

    const line = await rl.question("> ");
    if (EXIT_STRINGS.includes(line as (typeof EXIT_STRINGS)[number]))
      process.exit(0);

    req = reqs[line];
    if (!req) {
      console.error(c.red(`${c.b(line)} is not a valid request\nTry again.`));
    }
  }

  rl.close();
  return req;
}
