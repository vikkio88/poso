import { del, get, patch, post, put } from "./http";
import type { Method, RestRequest } from "./types";

const methodMapping: Record<Method, (req: RestRequest) => Promise<Response>> = {
  GET: get,
  POST: post,
  PUT: put,
  PATCH: patch,
  DELETE: del,
};

export function build(request: RestRequest) {
  const f = methodMapping[request.method];
  if (!f) {
    return null;
  }

  return () => f(request);
}
