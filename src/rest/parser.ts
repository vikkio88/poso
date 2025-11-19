import type { Method, RestRequest, Variables } from "./types";

const REQUEST_FORMAT =
  /^(GET|POST|PATCH|PUT|DELETE)\s+([^\n]+)(?:\n([\s\S]*?))?(?:\n\n([\s\S]*))?$/i;
export function parseRequest(
  requestString: string,
  variables: Variables = {},
): RestRequest | null {
  const matches = requestString.trim().match(REQUEST_FORMAT);

  const [, method, url, maybeHeaders, maybeBody] = matches || [];

  if (method === undefined || url === undefined) {
    return null;
  }

  const headers = parseHeaders(maybeHeaders, variables);

  return {
    method: method?.toUpperCase() as Method,
    url: applyVariables(url, variables)!,
    headers,
    body: applyVariables(maybeBody, variables),
  };
}

function parseHeaders(maybeHeaders: string | undefined, variables: Variables) {
  //TODO: apply variables
  return maybeHeaders
    ? Object.fromEntries(
        maybeHeaders
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.includes(":"))
          .map((l) => {
            const [k, ...r] = l.split(":");
            return [k!.trim(), r.join(":").trim()];
          }),
      )
    : {};
}

export function applyVariables(str: string | undefined, variables: Variables) {
  if (!str) {
    return str;
  }

  const keys = Object.keys(variables);
  if (!keys.length) return str;

  for (const key of keys) {
    str = str.replaceAll(`{{${key}}}`, variables[key]!);
  }

  return str;
}
