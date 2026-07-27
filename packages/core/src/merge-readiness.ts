/** Maximum controlled CI reruns permitted before human approval (BASE default). */
export const MAX_CONTROLLED_CI_RERUNS = 2;

export type MergeReadinessStatus = "READY_FOR_MERGE" | "BLOCKED";

export type CiFailureClassification =
  | "CODE_FAILURE"
  | "TEST_FAILURE"
  | "INFRA_FAILURE"
  | "FLAKY_SUSPECTED"
  | "UNKNOWN_FAILURE";

export interface CiFailureContext {
  exitCode?: number;
  jobName?: string;
  logSnippet?: string;
}

export interface MergeReadinessInput {
  acceptanceCriteriaMet: boolean;
  validateDocsPassed: boolean;
  checkFullPassed: boolean;
  ciPassed: boolean;
  reviewsComplete: boolean;
  ciFailureContext?: CiFailureContext;
  rerunCount?: number;
}

export interface MergeReadinessReport {
  status: MergeReadinessStatus;
  classification?: CiFailureClassification;
  blockingReasons: string[];
  rerunAllowed: boolean;
  rerunCount: number;
  summary: string;
}

/**
 * Classifies a CI failure log into the task-execution taxonomy.
 *
 * @param context - Exit code, job name, and optional log excerpt.
 * @returns Stable failure classification for agent routing.
 */
export function classifyCiFailure(context: CiFailureContext): CiFailureClassification {
  const snippet = context.logSnippet ?? "";

  if (/ECONNREFUSED|ETIMEDOUT|runner lost|503 service|rate limit exceeded/i.test(snippet)) {
    return "INFRA_FAILURE";
  }

  if (/AssertionError|expect\(|vitest|TEST_FAILURE|test failed/i.test(snippet)) {
    return "TEST_FAILURE";
  }

  if (
    /TypeScript error|tsc -p|build failed|eslint|compile error/i.test(snippet) ||
    context.exitCode === 1
  ) {
    return "CODE_FAILURE";
  }

  if (/flaky|intermittent/i.test(snippet)) {
    return "FLAKY_SUSPECTED";
  }

  return "UNKNOWN_FAILURE";
}

/**
 * Evaluates whether another controlled CI rerun is permitted.
 *
 * @param rerunCount - Number of reruns already consumed (not including the first attempt).
 * @returns Whether rerun is allowed and optional blocking reason.
 */
export function evaluateRerunPolicy(rerunCount: number): { allowed: boolean; reason?: string } {
  if (rerunCount >= MAX_CONTROLLED_CI_RERUNS) {
    return {
      allowed: false,
      reason: `Maximum controlled reruns (${MAX_CONTROLLED_CI_RERUNS}) exhausted; human approval required.`,
    };
  }

  return { allowed: true };
}

/**
 * Builds the merge readiness report for a PR milestone.
 *
 * @param input - Gate outcomes and optional CI failure context.
 * @returns Structured merge readiness report with READY_FOR_MERGE or BLOCKED.
 */
export function buildMergeReadinessReport(input: MergeReadinessInput): MergeReadinessReport {
  const blockingReasons: string[] = [];
  const rerunCount = input.rerunCount ?? 0;
  const rerunPolicy = evaluateRerunPolicy(rerunCount);

  if (!input.acceptanceCriteriaMet) {
    blockingReasons.push("Acceptance criteria not met.");
  }

  if (!input.validateDocsPassed) {
    blockingReasons.push("harness validate-docs failed.");
  }

  if (!input.checkFullPassed) {
    blockingReasons.push("harness check --full failed.");
  }

  if (!input.ciPassed) {
    blockingReasons.push("CI workflow did not pass.");
  }

  if (!input.reviewsComplete) {
    blockingReasons.push("Required independent review incomplete.");
  }

  let classification: CiFailureClassification | undefined;
  if (!input.ciPassed && input.ciFailureContext) {
    classification = classifyCiFailure(input.ciFailureContext);

    if (classification === "INFRA_FAILURE" && !rerunPolicy.allowed) {
      blockingReasons.push(rerunPolicy.reason ?? "Controlled rerun limit reached.");
    }
  }

  const status: MergeReadinessStatus =
    blockingReasons.length === 0 ? "READY_FOR_MERGE" : "BLOCKED";

  const rerunAllowed =
    classification === "INFRA_FAILURE" && rerunPolicy.allowed && status === "BLOCKED";

  return {
    status,
    classification,
    blockingReasons,
    rerunAllowed,
    rerunCount,
    summary:
      status === "READY_FOR_MERGE"
        ? "All required gates passed."
        : `Blocked: ${blockingReasons.join(" ")}`,
  };
}

/**
 * Serializes a merge readiness report for PR bodies and CI artifacts.
 *
 * @param report - Merge readiness report.
 * @returns JSON string with stable field ordering.
 */
export function serializeMergeReadinessReport(report: MergeReadinessReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Parses a serialized merge readiness report.
 *
 * @param json - JSON payload from CI or agent output.
 * @returns Parsed merge readiness report.
 */
export function parseMergeReadinessReport(json: string): MergeReadinessReport {
  const parsed = JSON.parse(json) as MergeReadinessReport;

  if (parsed.status !== "READY_FOR_MERGE" && parsed.status !== "BLOCKED") {
    throw new Error("Invalid merge readiness status.");
  }

  return parsed;
}
