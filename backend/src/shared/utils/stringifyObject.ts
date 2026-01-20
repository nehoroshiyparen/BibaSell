export function stringifyObject(obj: Record<string, any> | null): string {
  if (obj === null || obj === undefined) return "NULL";
  return JSON.stringify(obj);
}
