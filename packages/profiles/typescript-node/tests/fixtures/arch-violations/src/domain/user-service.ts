import { loadUserRow } from "../infrastructure/user-repo.js";

export function getUser(id: string): unknown {
  return loadUserRow(id);
}
