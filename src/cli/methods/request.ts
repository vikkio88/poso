import { c } from "../../libs/colours";
import { build } from "../../rest/builder";
import { safeParse } from "../../rest/http";
import { parseRequest } from "../../rest/parser";
import { argsParser } from "../args";

export async function request(argv: string[]) {
  //TODO: parse and remove flags, I could pass --stop-on-error and --show-headers
  // also could do --body and load a file with vars --vars and load files
  //  need to pass the correct flags
  const { args, flags } = argsParser(argv);
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

  if (response.status < 200 || response.status > 299) {
    console.error(
      `${c.red("Unexpected response status:")} ${c.b(response.status.toString())}`,
    );
    process.exit(1);
  }

  const responseBody = await safeParse(response);
  console.log(responseBody);
}
