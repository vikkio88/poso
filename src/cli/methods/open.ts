import fs from "node:fs";
import { APP_BIN } from "../../config";
import { c } from "../../libs/colours";

export function open(args: string[]) {
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

  console.log(filePath);
}
