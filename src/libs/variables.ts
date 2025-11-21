export type Variables = Record<string, string>;

export function parseVariables(varString: string | undefined): Variables {
  const vars: Variables = {};
  if (!varString) return vars;

  const regex = /@(\w+)=([^\s@]+)/g;
  let match;
  while ((match = regex.exec(varString)) !== null) {
    const [, key, value] = match;
    vars[key!] = value!;
  }

  return vars;
}
