/** Installed harness lock file shape. */
export interface HarnessLock {
  core: string;
  template: string;
  profileSdk: string;
  profile: string;
  capabilities: string[];
  blueprintVersion: string;
}

export interface UpgradeDiff {
  fromVersion: string;
  toVersion: string;
  profileChanged: boolean;
  capabilityChanges: {
    added: string[];
    removed: string[];
  };
  requiresMerge: boolean;
}

export interface UpgradeReport {
  ok: boolean;
  phase: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  dryRun: boolean;
  diff?: UpgradeDiff;
  findings: Array<{ id: string; severity: string; message: string }>;
  lockUpdated: boolean;
}
