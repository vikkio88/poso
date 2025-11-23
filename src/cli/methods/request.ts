import { c } from "../../libs/colours";
import { parseVariables } from "../../libs/variables";
import { build } from "../../rest/builder";
import { parseRequest } from "../../rest/parser";
import { argsParser } from "../args";
import { requestRunner, runnerFlags } from "../shared/reqRunner";

export async function request(argv: string[]) {
  const { args, flags } = argsParser(argv, runnerFlags);
  const [requestString, variables] = args;
  if (!requestString) {
    console.error(`${c.red("Missing parameter:")} ${c.b("request string")}`);
    process.exit(1);
  }

  const req = parseRequest(requestString, parseVariables(variables));
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

  requestRunner(req, runner, flags);
}
