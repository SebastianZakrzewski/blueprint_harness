export interface ArchitectureNode {
  id: string;
  label: string;
  dependsOn: string[];
}

export interface ArchitectureProjection {
  sha: string;
  generator: string;
  nodes: ArchitectureNode[];
  boundsApplied: boolean;
}

const MAX_NODES = 500;

/**
 * Bounded architecture projection (HP10).
 */
export class ArchitectureProjector {
  project(sha: string, nodes: ArchitectureNode[]): ArchitectureProjection | { error: string } {
    if (nodes.length > MAX_NODES) {
      return { error: "ARCHITECTURE_BOUNDS_EXCEEDED" };
    }
    return {
      sha,
      generator: "architecture-projection-v1",
      nodes,
      boundsApplied: nodes.length <= MAX_NODES,
    };
  }

  detectDrift(base: ArchitectureProjection, target: ArchitectureProjection): string[] {
    const drifts: string[] = [];
    const baseIds = new Set(base.nodes.map((n) => n.id));
    for (const node of target.nodes) {
      if (!baseIds.has(node.id)) {
        drifts.push(`ARCHITECTURE_DRIFT:${node.id}`);
      }
    }
    return drifts;
  }
}
