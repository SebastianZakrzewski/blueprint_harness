export interface QueryResource {
  projectId: string;
  sha: string;
  freshness: string;
  watermark: string;
  provenance: string;
}

export interface PlatformClientOptions {
  baseUrl: string;
  token: string;
}

/**
 * Parsed Query API client (HP14).
 */
export class PlatformClient {
  constructor(private readonly options: PlatformClientOptions) {}

  async getCommitState(projectId: string, sha: string): Promise<QueryResource> {
    const response = await fetch(
      `${this.options.baseUrl}/v1/projects/${encodeURIComponent(projectId)}/commits/${sha}`,
      {
        headers: { authorization: `Bearer ${this.options.token}` },
      },
    );

    if (response.status === 404) {
      throw new Error("SHA_NOT_FOUND");
    }
    if (!response.ok) {
      throw new Error(`PLATFORM_UNAVAILABLE:${response.status}`);
    }

    const body: unknown = await response.json();
    return this.parseResource(body, sha);
  }

  private parseResource(body: unknown, requestedSha: string): QueryResource {
    if (!body || typeof body !== "object") {
      throw new Error("INVALID_RESPONSE");
    }
    const record = body as Record<string, unknown>;
    if (record.sha !== requestedSha) {
      throw new Error("SHA_SUBSTITUTION_BLOCKED");
    }
    return {
      projectId: String(record.projectId),
      sha: String(record.sha),
      freshness: String(record.freshness),
      watermark: String(record.watermark),
      provenance: String(record.provenance),
    };
  }
}
