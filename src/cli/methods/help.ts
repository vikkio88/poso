import { APP_BIN } from "../../config";
import { c } from "../../libs/colours";
import { HEADER } from "../const";

export const HELP = `${HEADER}

${c.u("Usage:")}
  ${c.b(APP_BIN)} ${c.i("[method]")} ${c.i("[options]")}

${c.u("Methods:")}

  ${c.b("help")} [ ${c.b("h")}, "${c.b("-h")}" ]
    Show this help message.

  ${c.b("version")} [ ${c.b("v")}, "${c.b("--v")}", "${c.b("--version")}" ]
    Print the current version of ${APP_BIN}.

  ${c.b("request")} [ ${c.b("r")} ]
    ${c.i(`${APP_BIN} r "GET {{url}}/x" "@id=1 @url=..."`)}
    Execute a REST request defined inline or from a .http file.
    Supports variables, interpolation, and flags.

  ${c.b("open")} [ ${c.b("o")} ]
    ${c.i(`${APP_BIN} open ./file.http`)}
    Open a .http file and interactively select a request.
    Override variables or preselect a request with ${c.u("--request-name")} flag.
    Example: ${c.blue(`${APP_BIN} o ./file.http "@id=123" --request-name="Get One"`)}

    ${c.u("--list")} to just show a list of requests in a file:
    Example: ${c.blue(`${APP_BIN} o ./file.http --list`)}

  ${c.u("Flags (usable with both 'request' and 'open'):")}

    ${c.b("--stop-on-http-error")}
      Stop execution if the response status is not in the 2xx range.

    ${c.b("--show-headers")}
      Show response headers instead of only the body.

    ${c.b("--status-only")}
      Print only the response status code.

    ${c.b("--silent")}
      reduce verbosity.
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
