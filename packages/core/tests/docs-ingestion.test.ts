import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  FINDING_INGEST_DUPLICATE,
  HUMAN_JUDGMENT_REQUIRED,
  ingestDocs,
} from "../src/index.js";

const FIXTURES = join(fileURLToPath(import.meta.url), "..", "fixtures");

describe("docs-ingestion (M7)", () => {
  it("imports canonical fixture without semantic mapping (M7-AC1)", () => {
    const result = ingestDocs(join(FIXTURES, "docs-canonical"));

    expect(result.canonical).toBe(true);
    expect(result.mappingProposed).toBe(false);
    expect(result.proposedMappings).toBeUndefined();
  });

  it("produces proposed mapping artifact for non-canonical fixture (M7-AC2)", () => {
    const result = ingestDocs(join(FIXTURES, "docs-noncanonical"));

    expect(result.canonical).toBe(false);
    expect(result.mappingProposed).toBe(true);
    expect(result.proposedMappings?.length).toBeGreaterThan(0);
  });

  it("generates proposed manifest when source manifest is missing (M7-AC3)", () => {
    const result = ingestDocs(join(FIXTURES, "docs-noncanonical"));

    expect(result.manifestPresent).toBe(false);
    expect(result.manifestProposed).toBe(true);
    expect(result.proposedManifest?.length).toBeGreaterThan(0);
  });

  it("stops with HUMAN_JUDGMENT_REQUIRED on conflict fixture (M7-AC4)", () => {
    const result = ingestDocs(join(FIXTURES, "docs-conflict"));

    expect(result.humanJudgmentRequired).toBe(true);
    expect(
      result.findings.some(
        (finding) => finding.message === HUMAN_JUDGMENT_REQUIRED,
      ),
    ).toBe(true);
  });

  it("reports stable finding ID for duplicate content (M7-AC5)", () => {
    const result = ingestDocs(join(FIXTURES, "docs-duplicate"));

    expect(
      result.findings.some((finding) => finding.id === FINDING_INGEST_DUPLICATE),
    ).toBe(true);
  });
});
