import { help } from "./help";
import { open } from "./open";
import { request } from "./request";
import { version } from "./version";

const methods = ["help", "init", "generate", "snippets", "version"] as const;
export type MethodName = (typeof methods)[number];

export const map: Record<MethodName | string, (args: string[]) => void> = {
  help: () => help(),
  h: () => help(),
  "-h": () => help(),
  version,
  v: version,
  "-v": version,
  "--version": version,

  o: open,
  open,

  r: request,
  req: request,
  request,
};
