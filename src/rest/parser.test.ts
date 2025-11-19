import { describe, expect, test } from "bun:test";
import { applyVariables, parseRequest } from "./parser";

describe("requestParser", () => {
  test("method + url only", () => {
    const result = parseRequest("GET ciao.com");
    expect(result).toEqual({
      method: "GET",
      url: "ciao.com",
      headers: {},
      body: undefined,
    });
  });

  test("lowercase method", () => {
    const result = parseRequest("post api.com");
    expect(result?.method).toBe("POST");
    expect(result?.url).toBe("api.com");
  });

  test("with headers", () => {
    const result = parseRequest(
      `POST api.com
Auth: Bearer 123
X-Test: yes`,
    );

    expect(result).toEqual({
      method: "POST",
      url: "api.com",
      headers: {
        Auth: "Bearer 123",
        "X-Test": "yes",
      },
      body: undefined,
    });
  });

  test("with body only", () => {
    const result = parseRequest(
      `POST api.com
Content-Type: application/json

{"a":1}`,
    );

    expect(result).toEqual({
      method: "POST",
      url: "api.com",
      headers: { "Content-Type": "application/json" },
      body: `{"a":1}`,
    });
  });

  test("with headers + body", () => {
    const result = parseRequest(
      `PATCH site.com
Authorization: Token X
Content-Type: application/json

{"hello":"world"}`,
    );

    expect(result).toEqual({
      method: "PATCH",
      url: "site.com",
      headers: {
        Authorization: "Token X",
        "Content-Type": "application/json",
      },
      body: `{"hello":"world"}`,
    });
  });

  test("multiple headers and multiline body", () => {
    const result = parseRequest(
      `PUT server.net
A: 1
B: 2
C:   3

line1
line2`,
    );

    expect(result).toEqual({
      method: "PUT",
      url: "server.net",
      headers: {
        A: "1",
        B: "2",
        C: "3",
      },
      body: "line1\nline2",
    });
  });

  test("invalid request returns null", () => {
    const result = parseRequest("not a valid request format");
    expect(result).toBeNull();
  });
});

describe("applyVariables", () => {
  test("replaces a single variable", () => {
    const str = "Hello {{name}}";
    const result = applyVariables(str, { name: "mario" });
    expect(result).toBe("Hello mario");
  });

  test("replaces multiple variables", () => {
    const str = "Hello {{name}}, welcome to {{place}}";
    const result = applyVariables(str, { name: "mario", place: "caccaland" });
    expect(result).toBe("Hello mario, welcome to caccaland");
  });

  test("returns original string if no variables found", () => {
    const str = "Nothing to replace";
    const result = applyVariables(str, { name: "mario" });
    expect(result).toBe("Nothing to replace");
  });

  test("returns original string if variables object is empty", () => {
    const str = "Hello {{name}}";
    const result = applyVariables(str, {});
    expect(result).toBe("Hello {{name}}");
  });

  test("handles repeated variable usage", () => {
    const str = "{{x}} + {{x}} = {{x}}";
    const result = applyVariables(str, { x: "5" });
    expect(result).toBe("5 + 5 = 5");
  });

  test("does not replace unknown variables", () => {
    const str = "Hi {{known}} and {{unknown}}";
    const result = applyVariables(str, { known: "A" });
    expect(result).toBe("Hi A and {{unknown}}");
  });
});
