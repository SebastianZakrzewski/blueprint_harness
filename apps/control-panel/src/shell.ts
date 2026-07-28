import { PlatformClient } from "@blueprint-harness/platform-client";

export interface PanelShellState {
  projectId: string;
  sha: string;
  view: string;
}

/**
 * Control Panel shell state and navigation (HP13).
 */
export class ControlPanelShell {
  constructor(private readonly client: PlatformClient) {}

  parseRoute(path: string): PanelShellState | null {
    const match = path.match(/^\/projects\/([^/]+)\/commits\/([0-9a-f]{40})(?:\/(.+))?$/);
    if (!match) {
      return null;
    }
    return {
      projectId: decodeURIComponent(match[1]!),
      sha: match[2]!,
      view: match[3] ?? "overview",
    };
  }

  async loadState(path: string) {
    const route = this.parseRoute(path);
    if (!route) {
      throw new Error("INVALID_ROUTE");
    }
    const resource = await this.client.getCommitState(route.projectId, route.sha);
    return { route, resource };
  }
}
