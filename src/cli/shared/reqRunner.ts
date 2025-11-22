import { c } from "../../libs/colours";
import { safeParse } from "../../rest/http";

export const runnerFlags = [
  "stop-on-http-error",
  "show-headers",
  "status-only",
] as const;

export async function requestRunner(
  runner: () => Promise<Response>,
  flags: Record<(typeof runnerFlags)[number], string | boolean> = {
    "status-only": false,
    "show-headers": false,
    "stop-on-http-error": false,
  },
) {
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
