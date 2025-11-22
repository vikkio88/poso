import fs from "node:fs";
import { createInterface } from "node:readline/promises";
import { APP_BIN } from "../../config";
import { parseFile } from "../../http/file";
import { c } from "../../libs/colours";
import { build } from "../../rest/builder";
import type { RestRequest } from "../../rest/types";
import { argsParser } from "../args";
import { requestRunner, runnerFlags } from "../shared/reqRunner";

export async function open(argv: string[]) {
  const { args, flags } = argsParser(argv, [
    ...runnerFlags,
    "request-name",
  ] as const);
  const [filePath] = args;

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

  const content = fs.readFileSync(filePath);
  if (!content) {
    console.error(`${c.red("Not content on file:")} ${c.b(filePath)}`);
    process.exit(1);
  }

  const reqs = parseFile(content.toString());
  if (reqs.length === 0) {
    console.error(`${c.red("Not requests on file:")} ${c.b(filePath)}`);
    process.exit(1);
  }
  let req: RestRequest | undefined;
  if (reqs.length === 1) {
    console.log(`File ${c.b(filePath)} has only 1 request, executing it...\n`);
    req = Object.values(reqs.requests)[0]!;
  }

  if (flags["request-name"]) {
    const name = flags["request-name"] as string;
    req = reqs.requests[name];
    if (!req) {
      console.error(
        `${c.red(`Request with name ${name} does not exist on file:`)} ${c.b(filePath)}`,
      );
      list(reqs.requests);
      process.exit(1);
    }
  }

  if (!req) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    while (!req) {
      console.log("Choose:");
      list(reqs.requests);
      console.log(`${c.b("exit")} to stop.`);
      const line = await rl.question("> ");
      if (line === "exit") process.exit(0);

      req = reqs.requests[line];
      if (!req) {
        console.error(
          c.red(`${c.b(line)} is not a valid request.
          Try again.`),
        );
      }
    }
  }

  await exec(req, flags, filePath);
}

async function exec(
  req: RestRequest,
  flags: Record<string, string | boolean>,
  filePath: string,
) {
  const r = build(req);
  if (!r) {
    console.error(`${c.red("Invalid request syntax:")} ${c.b(filePath)}`);
    process.exit(1);
  }

  await requestRunner(r, flags);
}

function list(reqs: Record<string, RestRequest>) {
  console.log(
    `${c.b("Requests:")}\n${Object.keys(reqs)
      .map((r) => `- ${r}\n`)
      .join("")}`,
  );
}
