import { parseUserId } from "../shared/ids.js";

export function getUser(id: string): string {
  return parseUserId(id);
}
