import type { HttpFile } from "./types";

import { parseVariables } from "../libs/variables";
import { parseRequest } from "../rest/parser";
import type { RestRequest } from "../rest/types";

export function parseFile(fileString: string): HttpFile {
  const trimmed = fileString.trim();
  const lines = trimmed.split(/\r?\n/);
  let i = 0;

  let varsBlock = "";
  while (i < lines.length && lines[i]!.trim().startsWith("@")) {
    varsBlock += lines[i] + "\n";
    i++;
  }

  const variables = parseVariables(varsBlock);

  const rest = trimmed.slice(varsBlock.length).trim();

  const parts = rest.split(/\n?###\s*/);

  const requests: Record<string, RestRequest> = {};

  for (let idx = 0; idx < parts.length; idx++) {
    const block = parts[idx]!.trim();
    if (!block) continue;

    const m = block.match(/^([^\n]+)\n([\s\S]*)$/);
    let key = idx.toString();
    let body;

    if (
      m &&
      !m[1]!.startsWith("GET") &&
      !m[1]!.startsWith("POST") &&
      !m[1]!.startsWith("PUT") &&
      !m[1]!.startsWith("PATCH") &&
      !m[1]!.startsWith("DELETE")
    ) {
      key = m[1]!.trim();
      body = m[2]!.trim();
    } else {
      body = block;
    }

    const parsed = parseRequest(body, variables);
    if (parsed) requests[key] = parsed;
  }

  return { variables, requests };
}
