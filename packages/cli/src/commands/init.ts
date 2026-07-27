import { runBootstrap } from "@blueprint-harness/core";
import { renderCursorAdapter, renderTemplate } from "@blueprint-harness/template-openai";

import { emitValidationResult, type OutputFormat } from "../output.js";

export interface InitCommandOptions {
  docsPath: string;
  targetPath: string;
  selfApply?: boolean;
  skipAnchorCheck?: boolean;
  format?: OutputFormat;
}

/**
 * Runs harness init bootstrap through HARNESS_INSTALLED.
 *
 * @param options - Docs source, target path, and bootstrap flags.
 * @returns Process exit code.
 */
export async function runInit(options: InitCommandOptions): Promise<number> {
  const format = options.format ?? "human";
  const result = await runBootstrap({
    docsPath: options.docsPath,
    targetDir: options.targetPath,
    selfApply: options.selfApply,
    skipAnchorCheck: options.skipAnchorCheck,
    renderHarness: (targetDir, context) => {
      if (options.selfApply) {
        return renderCursorAdapter(targetDir, context);
      }
      return renderTemplate(targetDir, context);
    },
  });

  if (result.ok) {
    const message =
      format === "json"
        ? JSON.stringify({ ok: true, state: result.state, writtenFiles: result.writtenFiles })
        : `init: reached ${result.state}`;
    console.log(message);
    return 0;
  }

  return emitValidationResult(
    { ok: false, findings: result.findings },
    format,
    "init",
  );
}
