import {
  cleanupEnvironment,
  getEnvironmentStatus,
  provisionEnvironment,
} from "@blueprint-harness/core";

import type { OutputFormat } from "../output.js";

export type EnvAction = "up" | "down" | "status";

export interface EnvCommandOptions {
  action: EnvAction;
  rootPath?: string;
  worktreeId?: string;
  format?: OutputFormat;
}

/**
 * Runs harness env up|down|status for isolated worktree environments.
 *
 * @param options - Action, optional root, and output format.
 * @returns Process exit code (0 on success).
 */
export function runEnv(options: EnvCommandOptions): number {
  const projectRoot = options.rootPath ?? process.cwd();
  const format = options.format ?? "human";

  if (options.action === "up") {
    const record = provisionEnvironment(projectRoot, options.worktreeId);
    const output =
      format === "json"
        ? JSON.stringify(record)
        : `env up: worktree=${record.worktreeId} appPort=${record.appPort} dbPort=${record.databasePort}`;
    console.log(output);
    return 0;
  }

  if (options.action === "down") {
    const record = cleanupEnvironment(projectRoot, options.worktreeId);
    const output =
      format === "json"
        ? JSON.stringify(record ?? { status: "down" })
        : `env down: worktree=${options.worktreeId ?? "default"} cleaned`;
    console.log(output);
    return 0;
  }

  const status = getEnvironmentStatus(projectRoot, options.worktreeId);
  if (format === "json") {
    console.log(JSON.stringify(status));
  } else {
    console.log(
      `worktreeId=${status.worktreeId} status=${status.status} health=${status.health} appPort=${status.appPort} dbPort=${status.databasePort} db=${status.databaseName}`,
    );
  }

  return 0;
}
