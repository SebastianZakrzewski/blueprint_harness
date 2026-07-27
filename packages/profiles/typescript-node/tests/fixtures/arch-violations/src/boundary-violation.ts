export function parseUntrusted(input: string): unknown {
  return eval(input);
}
