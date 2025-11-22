import { expect, test } from "bun:test";
import { parseFile } from "./file";

test("parses variables and one simple request", () => {
  const file = `@id=2

GET https://jsonplaceholder.typicode.com/todos/{{id}}
`;

  const result = parseFile(file);

  expect(result.variables).toEqual({ id: "2" });

  expect(Object.keys(result.requests)).toEqual(["0"]);

  expect(result.requests["0"]).toEqual({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/todos/2",
    headers: {},
    body: undefined,
  });
});

test("parses multiple requests separated by ### blocks", () => {
  const file = `
@url=http://localhost:3000/api/users
@id=10

GET {{url}}?q=mario

### Delete
DELETE {{url}}/{{id}}

### Get One
GET {{url}}/{{id}}

### Create
POST {{url}}
Content-Type: application/json

{
  "name": "Mario",
  "isActive": true
}
`;

  const result = parseFile(file);

  expect(result.variables).toEqual({
    url: "http://localhost:3000/api/users",
    id: "10",
  });

  expect(Object.keys(result.requests)).toEqual([
    "0",
    "Delete",
    "Get One",
    "Create",
  ]);

  expect(result.requests["0"]!.url).toBe(
    "http://localhost:3000/api/users?q=mario",
  );
  expect(result.requests["Delete"]!.url).toBe(
    "http://localhost:3000/api/users/10",
  );
  expect(result.requests["Get One"]!.url).toBe(
    "http://localhost:3000/api/users/10",
  );
  expect(result.requests["Create"]!.method).toBe("POST");
});

test("unnamed sections still get indexed keys", () => {
  const file = `
@a=1

GET /x

###
POST /y
`;

  const result = parseFile(file);

  expect(Object.keys(result.requests)).toEqual(["0", "1"]);
  expect(result.requests["0"]!.method).toBe("GET");
  expect(result.requests["1"]!.method).toBe("POST");
});

test("ignores empty request blocks", () => {
  const file = `
@a=1

GET /x


### Foo


### Bar
POST /y
`;

  const result = parseFile(file);

  expect(Object.keys(result.requests)).toEqual(["0", "Bar"]);
});
