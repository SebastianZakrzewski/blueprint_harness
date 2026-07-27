export {
  compareHarnessLocks,
  isIncompatibleProfile,
  readHarnessLock,
} from "./compare.js";
export {
  classifyUpgradeOwnership,
  runUpgrade,
  type RunUpgradeOptions,
} from "./run.js";
export type { HarnessLock, UpgradeDiff, UpgradeReport } from "./types.js";
