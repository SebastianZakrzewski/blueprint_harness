import { describe, expect, it } from "vitest";

import {
  buildMergeReadinessReport,
  classifyCiFailure,
  evaluateRerunPolicy,
  MAX_CONTROLLED_CI_RERUNS,
  parseMergeReadinessReport,
  serializeMergeReadinessReport,
} from "../src/merge-readiness.js";

describe("merge readiness (M12)", () => {
  it("reports READY_FOR_MERGE when all gates pass (M12-AC3)", () => {
    const report = buildMergeReadinessReport({
      acceptanceCriteriaMet: true,
      validateDocsPassed: true,
      checkFullPassed: true,
      ciPassed: true,
      reviewsComplete: true,
    });

    expect(report.status).toBe("READY_FOR_MERGE");
    const roundTrip = parseMergeReadinessReport(serializeMergeReadinessReport(report));
    expect(roundTrip.status).toBe("READY_FOR_MERGE");
  });

  it("classifies test failures as TEST_FAILURE (M12-AC2)", () => {
    const classification = classifyCiFailure({
      logSnippet: "AssertionError: expected true to be false",
      exitCode: 1,
    });
    expect(classification).toBe("TEST_FAILURE");
  });

  it("classifies compile failures as CODE_FAILURE (M12-AC2)", () => {
    const classification = classifyCiFailure({
      logSnippet: "TypeScript error TS2345: Argument of type",
      exitCode: 1,
    });
    expect(classification).toBe("CODE_FAILURE");
  });

  it("blocks third controlled rerun without approval (M12-AC4)", () => {
    expect(evaluateRerunPolicy(0).allowed).toBe(true);
    expect(evaluateRerunPolicy(1).allowed).toBe(true);
    expect(evaluateRerunPolicy(MAX_CONTROLLED_CI_RERUNS).allowed).toBe(false);

    const report = buildMergeReadinessReport({
      acceptanceCriteriaMet: true,
      validateDocsPassed: true,
      checkFullPassed: true,
      ciPassed: false,
      reviewsComplete: true,
      rerunCount: MAX_CONTROLLED_CI_RERUNS,
      ciFailureContext: { logSnippet: "runner lost communication with the server" },
    });

    expect(report.status).toBe("BLOCKED");
    expect(report.classification).toBe("INFRA_FAILURE");
    expect(report.rerunAllowed).toBe(false);
  });
});
