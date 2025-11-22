import { expect, test } from "bun:test";
import { parseVariables, type Variables } from "./variables";

test("parses multi-line variables", () => {
  const input = `
@id=CIAO
@url=https://ciao.com
`;
  const expected: Variables = {
    id: "CIAO",
    url: "https://ciao.com",
  };
  expect(parseVariables(input)).toEqual(expected);
});

test("parses multi-line variables with spaces", () => {
  const input = `
@id = CIAO
@url = https://ciao.com
`;
  const expected: Variables = {
    id: "CIAO",
    url: "https://ciao.com",
  };
  expect(parseVariables(input)).toEqual(expected);
});

test("parses single-line variables", () => {
  const input = "@id=CIAO @url=https://ciao.com";
  const expected: Variables = {
    id: "CIAO",
    url: "https://ciao.com",
  };
  expect(parseVariables(input)).toEqual(expected);
});

test("ignores invalid lines", () => {
  const input = "@blabla=11123 not-a-variable @url=https://ciao.com";
  const expected: Variables = {
    blabla: "11123",
    url: "https://ciao.com",
  };
  expect(parseVariables(input)).toEqual(expected);
});

test("returns empty object for undefined or empty input", () => {
  expect(parseVariables(undefined)).toEqual({});
  expect(parseVariables("")).toEqual({});
});
