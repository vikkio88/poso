import fs from "node:fs";
import { APP_BIN } from "../../config";
import { parseFile } from "../../http/file";
import { c } from "../../libs/colours";
import { build } from "../../rest/builder";
import { requestRunner } from "../shared/reqRunner";

export async function open(args: string[]) {
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

  if (reqs.length === 1) {
    console.log(`File ${filePath} has only 1 request, executing it...\n`);
    const req = Object.values(reqs.requests)[0]!;
    const r = build(req);
    if (!r) {
      console.error(`${c.red("Invalid request syntax:")} ${c.b(filePath)}`);
      process.exit(1);
    }

    await requestRunner(r);
    return;
  }

  //TODO: if there are more requests and we did not specified which one we need to pick
}
