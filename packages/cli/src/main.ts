import { Command } from "commander";

import { runAutonomyStatus } from "./commands/autonomy.js";
import { runCheck } from "./commands/check.js";
import { runEnv } from "./commands/env.js";
import { runInit } from "./commands/init.js";
import { runInspect } from "./commands/inspect.js";
import { runValidateDocs } from "./commands/validate-docs.js";
import { cliVersion } from "./version.js";

/**
 * Creates the harness CLI program with subcommands.
 *
 * @returns Configured Commander program (not yet parsed).
 */
export function createHarnessProgram(): Command {
  const program = new Command();

  program
    .name("harness")
    .description("Harness Blueprint CLI")
    .version(cliVersion, "-V, --version", "print harness version");

  program
    .command("validate-docs")
    .description("Validate documentation structure and ExecPlans")
    .option("--format <format>", "human or json", "human")
    .option("--root <path>", "repository root override")
    .action((options: { format?: string; root?: string }) => {
      const format = options.format === "json" ? "json" : "human";
      const exitCode = runValidateDocs({ rootPath: options.root, format });
      process.exitCode = exitCode;
    });

  program
    .command("inspect")
    .description("Inspect blueprint version and workspace packages")
    .option("--format <format>", "human or json", "human")
    .option("--root <path>", "repository root override")
    .action((options: { format?: string; root?: string }) => {
      const format = options.format === "json" ? "json" : "human";
      const exitCode = runInspect({ rootPath: options.root, format });
      process.exitCode = exitCode;
    });

  program
    .command("check")
    .description("Run harness checks")
    .option("--fast", "run fast check providers")
    .option("--full", "run full check providers (superset of --fast)")
    .option("--format <format>", "human or json", "human")
    .option("--root <path>", "repository root override")
    .action((options: { fast?: boolean; full?: boolean; format?: string; root?: string }) => {
      if (!options.fast && !options.full) {
        console.error("harness check requires --fast or --full");
        process.exitCode = 1;
        return;
      }

      const format = options.format === "json" ? "json" : "human";
      const mode = options.full ? "full" : "fast";
      const exitCode = runCheck({ mode, rootPath: options.root, format });
      process.exitCode = exitCode;
    });

  program
    .command("init")
    .description("Bootstrap harness through HARNESS_INSTALLED")
    .requiredOption("--docs <path>", "incoming docs root")
    .requiredOption("--target <path>", "bootstrap target directory")
    .option("--self-apply", "Blueprint self-apply mode (cursor + config only)")
    .option("--skip-anchor-check", "skip git anchor requirement (tests)")
    .option("--format <format>", "human or json", "human")
    .action(async (options: {
      docs: string;
      target: string;
      selfApply?: boolean;
      skipAnchorCheck?: boolean;
      format?: string;
    }) => {
      const format = options.format === "json" ? "json" : "human";
      const exitCode = await runInit({
        docsPath: options.docs,
        targetPath: options.target,
        selfApply: options.selfApply,
        skipAnchorCheck: options.skipAnchorCheck,
        format,
      });
      process.exitCode = exitCode;
    });

  const envCmd = program.command("env").description("Manage isolated worktree environment");

  envCmd
    .command("up")
    .description("Provision isolated environment for current worktree")
    .option("--root <path>", "project root override")
    .option("--worktree-id <id>", "explicit worktree id")
    .option("--format <format>", "human or json", "human")
    .action((options: { root?: string; worktreeId?: string; format?: string }) => {
      process.exitCode = runEnv({
        action: "up",
        rootPath: options.root,
        worktreeId: options.worktreeId,
        format: options.format === "json" ? "json" : "human",
      });
    });

  envCmd
    .command("down")
    .description("Clean up tagged environment resources")
    .option("--root <path>", "project root override")
    .option("--worktree-id <id>", "explicit worktree id")
    .option("--format <format>", "human or json", "human")
    .action((options: { root?: string; worktreeId?: string; format?: string }) => {
      process.exitCode = runEnv({
        action: "down",
        rootPath: options.root,
        worktreeId: options.worktreeId,
        format: options.format === "json" ? "json" : "human",
      });
    });

  envCmd
    .command("status")
    .description("Show environment health without secrets")
    .option("--root <path>", "project root override")
    .option("--worktree-id <id>", "explicit worktree id")
    .option("--format <format>", "human or json", "human")
    .action((options: { root?: string; worktreeId?: string; format?: string }) => {
      process.exitCode = runEnv({
        action: "status",
        rootPath: options.root,
        worktreeId: options.worktreeId,
        format: options.format === "json" ? "json" : "human",
      });
    });

  const autonomyCmd = program.command("autonomy").description("Autonomy policy status");

  autonomyCmd
    .command("status")
    .description("Report autonomy level, freeze state, and OD-008 gates")
    .option("--format <format>", "human or json", "human")
    .action((options: { format?: string }) => {
      process.exitCode = runAutonomyStatus({
        format: options.format === "json" ? "json" : "human",
      });
    });

  return program;
}

/**
 * Parses argv and runs the matching harness subcommand.
 *
 * @param argv - CLI arguments (defaults to process.argv).
 */
export function runHarness(argv: string[] = process.argv): void {
  const program = createHarnessProgram();
  program.parse(argv);
}
