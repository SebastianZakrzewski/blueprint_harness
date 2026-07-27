import { buildValidationResult } from "../validation-result.js";

export type PermissionAction =
  | "ssh_remote"
  | "read_secret"
  | "direct_db_write"
  | "ci_bypass"
  | "self_promote";

/**
 * Evaluates permission-boundary actions for agent operations.
 *
 * @param action - Permission action identifier.
 */
export function evaluatePermissionAction(action: PermissionAction): ReturnType<typeof buildValidationResult> {
  const blocked: PermissionAction[] = [
    "ssh_remote",
    "read_secret",
    "direct_db_write",
    "ci_bypass",
    "self_promote",
  ];

  if (!blocked.includes(action)) {
    return buildValidationResult([]);
  }

  const messages: Record<PermissionAction, string> = {
    ssh_remote: "SSH remote access is not permitted for agents.",
    read_secret: "Direct secret read is not permitted for agents.",
    direct_db_write: "Direct database write bypasses domain boundaries.",
    ci_bypass: "CI bypass attempts violate HARNESS-001.",
    self_promote: "Autonomy self-promotion is prohibited.",
  };

  return buildValidationResult([
    {
      id: "PERM-001",
      severity: "error",
      message: messages[action],
      remediation: "Use approved harness workflows and human judgment for elevated permissions.",
    },
  ]);
}
