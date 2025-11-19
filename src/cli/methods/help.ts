import { APP_BIN } from "../../config";
import { c } from "../../libs/colours";
import { HEADER } from "../const";

export const HELP = `${HEADER}

${c.u("Usage:")}
  ${c.b(APP_BIN)} ${c.i("[method]")} ${c.i("[options]")}
`;

export function help({
  error = false,
  message,
}: {
  error?: boolean;
  message?: string;
} = {}) {
  if (error) {
    console.log(`${c.red("Error")}: ${message || "not a valid command"}`);
  }
  console.log(`${HELP}`);
}
