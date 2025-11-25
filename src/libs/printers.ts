import util from "node:util";

export function printJs(obj: object) {
  console.log(util.inspect(obj, { depth: null, colors: true }));
}

export function printJson(obj: object) {
  console.log(JSON.stringify(obj, null, 2));
}
