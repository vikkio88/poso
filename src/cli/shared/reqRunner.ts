import { c } from "../../libs/colours";
import { safeParse } from "../../rest/http";
import type { RestRequest } from "../../rest/types";

export const runnerFlags = [
  "stop-on-http-error",
  "show-headers",
  "status-only",
  "silent",
] as const;

export async function requestRunner(
  req: RestRequest,
  runner: () => Promise<Response>,
  flags: Record<(typeof runnerFlags)[number], string | boolean> = {
    "status-only": false,
    "show-headers": false,
    "stop-on-http-error": false,
    silent: false,
  },
) {
  if (!flags.silent) {
    const hr = "-".repeat(req.method.length + req.url.length + 6);
    console.log(`${hr}
  Executing request:
    ${c.b(`${c.green(req.method)} ${c.blue(req.url)}`)}
${hr}
    `);
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
