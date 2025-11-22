import { parseVariables } from "../libs/variables";
import { parseRequest } from "../rest/parser";
import type { RestRequest } from "../rest/types";
import type { HttpFile } from "./types";

export function parseFile(fileString: string): HttpFile {
  const raw = fileString.replace(/\r/g, "");
  const lines = raw.split("\n");

  let i = 0;
  while (i < lines.length && lines[i]!.trim() === "") i++;

  const varLines: string[] = [];
  while (i < lines.length && lines[i]!.trim().startsWith("@")) {
    varLines.push(lines[i]!);
    i++;
  }

  const variables = parseVariables(varLines.join("\n"));
  const rest = lines.slice(i).join("\n");
  const parts = rest.split(/\n?###\s*/);

  const requests: Record<string, RestRequest> = {};
  let auto = 0;

  for (const part of parts) {
    const block = part.trim();
    if (!block) continue;

    const m = block.match(/^([^\n]+)\n([\s\S]*)$/);
    let key: string;
    let body: string;

    if (m && !/^(GET|POST|PUT|PATCH|DELETE)\b/.test(m[1]!)) {
      key = m[1]!.trim();
      body = m[2]!.trim();
    } else {
      key = String(auto++);
      body = block;
    }

    const parsed = parseRequest(body, variables);
    if (parsed) requests[key] = parsed;
  }

  return { variables, requests, length: Object.keys(requests).length };
}
