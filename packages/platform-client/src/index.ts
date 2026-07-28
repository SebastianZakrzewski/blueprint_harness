import { PLATFORM_CONTRACTS_VERSION } from "@blueprint-harness/platform-contracts";

/** Read-only Query API client surface (HP1 scaffold). */
export function clientContractVersion(): string {
  return PLATFORM_CONTRACTS_VERSION;
}
