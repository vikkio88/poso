export type Variables = Record<string, string>;
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type RestRequest = {
  method: Method;
  url: string;
  headers: Record<string, string> | undefined;
  body: string | undefined;
};
