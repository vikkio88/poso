import type { RestRequest } from "./types";

export function basicHeaders(additional = {}) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...additional,
  };
}

export function get(req: RestRequest) {
  return fetch(req.url, {
    method: "GET",
    headers: { ...basicHeaders(), ...(req.headers ?? {}) },
  });
}

export function del(req: RestRequest) {
  return fetch(req.url, {
    method: "DELETE",
    headers: { ...basicHeaders(), ...(req.headers ?? {}) },
  });
}

export function post<T>(req: RestRequest) {
  return fetch(req.url, {
    method: "POST",
    headers: { ...basicHeaders(), ...(req.headers ?? {}) },
    body: req.body,
  });
}

export function put<T>(req: RestRequest) {
  return fetch(req.url, {
    method: "PUT",
    headers: { ...basicHeaders(), ...(req.headers ?? {}) },
    body: req.body,
  });
}

export function patch<T>(req: RestRequest) {
  return fetch(req.url, {
    method: "PATCH",
    headers: { ...basicHeaders(), ...(req.headers ?? {}) },
    body: req.body,
  });
}

export async function safeParse(resp: Response): Promise<any | null> {
  try {
    const result = await resp.json();
    return result as any;
  } catch (err) {
    console.error(`Error whilst parsing response json`, err);
    return null;
  }
}
