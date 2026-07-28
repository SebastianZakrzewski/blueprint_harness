export type CriterionStatus = "PASS" | "FAIL" | "NOT_EVALUATED";

export interface CriterionNode {
  id: string;
  dependsOn: string[];
}

export interface CriteriaRegistry {
  version: string;
  nodes: CriterionNode[];
}

/**
 * Criteria registry with dependency validation (HP5).
 */
export class CriteriaEngine {
  constructor(private readonly registry: CriteriaRegistry) {}

  validateGraph(): string[] {
    const ids = new Set(this.registry.nodes.map((n) => n.id));
    const errors: string[] = [];
    for (const node of this.registry.nodes) {
      for (const dep of node.dependsOn) {
        if (!ids.has(dep)) {
          errors.push(`Unknown dependency ${dep} for ${node.id}`);
        }
      }
    }
    return errors;
  }

  evaluate(passedIds: Set<string>): Map<string, CriterionStatus> {
    const result = new Map<string, CriterionStatus>();
    for (const node of this.registry.nodes) {
      const depsPass = node.dependsOn.every((dep) => passedIds.has(dep));
      const selfPass = passedIds.has(node.id);
      result.set(
        node.id,
        depsPass && selfPass ? "PASS" : selfPass ? "FAIL" : "NOT_EVALUATED",
      );
    }
    return result;
  }
}
