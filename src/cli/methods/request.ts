import { c } from "../../libs/colours";
import { build } from "../../rest/builder";
import { safeParse } from "../../rest/http";
import { parseRequest } from "../../rest/parser";
import { argsParser } from "../args";

const allowedFlags = [
  "stop-on-http-error",
  "show-headers",
  "status-only",
] as const;

export async function request(argv: string[]) {
  const { args, flags } = argsParser(argv, allowedFlags);
  const [requestString] = args;
  if (!requestString) {
    console.error(`${c.red("Missing parameter:")} ${c.b("request string")}`);
    process.exit(1);
  }

  const req = parseRequest(requestString);
  if (!req) {
    console.error(
      `${c.red("Failed to parse request string:")} ${c.b(requestString)}`,
    );
    process.exit(1);
  }

  const runner = build(req);
  if (!runner) {
    console.error(`${c.red("Failed to build request for:")} ${c.b(req.url)}`);
    process.exit(1);
  }

  const response = await runner();

  if (flags["status-only"]) {
    console.log(response.status);
    process.exit(0);
  }

  if (
    (flags["stop-on-http-error"] && response.status < 200) ||
    response.status > 299
  ) {
    console.error(
      `${c.red("Unexpected response status:")} ${c.b(response.status.toString())}`,
    );
    process.exit(1);
  }

  const responseBody = await safeParse(response);
  if (flags["show-headers"]) {
    console.log(response.headers);
    console.log();
  }
  console.log(responseBody);
}
