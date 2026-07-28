import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import {
  EventHistory,
  Projector,
  Reconciler,
  SnapshotPolicy,
} from "@blueprint-harness/platform-domain";

export interface QueryApiOptions {
  port?: number;
  authToken?: string;
}

export interface QueryResource {
  projectId: string;
  sha: string;
  freshness: string;
  watermark: string;
  provenance: string;
}

/**
 * Minimal read-only Query API (HP12).
 */
export class QueryApiServer {
  private readonly history = new EventHistory();
  private readonly projector = new Projector();
  private readonly reconciler = new Reconciler();
  private readonly snapshots = new SnapshotPolicy();
  private server: ReturnType<typeof createServer> | null = null;

  ingestRaw(raw: string, key: string): void {
    this.history.ingest(raw, key);
  }

  async start(options: QueryApiOptions = {}): Promise<number> {
    const port = options.port ?? 0;
    const token = options.authToken ?? "dev-token";

    this.server = createServer((req, res) => {
      void this.handle(req, res, token);
    });

    return new Promise((resolve, reject) => {
      this.server!.listen(port, () => {
        const address = this.server!.address();
        if (address && typeof address === "object") {
          resolve(address.port);
        } else {
          reject(new Error("Failed to bind Query API"));
        }
      });
    });
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }
      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async handle(
    req: IncomingMessage,
    res: ServerResponse,
    token: string,
  ): Promise<void> {
    if (req.headers.authorization !== `Bearer ${token}`) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "UNAUTHORIZED" }));
      return;
    }

    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    const match = url.pathname.match(
      /^\/v1\/projects\/([^/]+)\/commits\/([0-9a-f]{40})$/,
    );
    if (!match) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "NOT_FOUND" }));
      return;
    }

    const projectId = decodeURIComponent(match[1]!);
    const sha = match[2]!;
    const snapshot = this.projector.rebuild(this.history.all());
    if (!snapshot || snapshot.sha !== sha || snapshot.projectId !== projectId) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "SHA_NOT_FOUND" }));
      return;
    }

    const freshness = this.reconciler.reconcile({
      projectId,
      sha,
      sourceEventCount: this.history.all().length,
      projectedEventCount: this.history.all().length,
      staleAfterMs: 300_000,
      lastUpdateAt: snapshot.watermark,
    });

    const body: QueryResource = {
      projectId,
      sha,
      freshness: freshness.freshness,
      watermark: snapshot.watermark,
      provenance: snapshot.provenance,
    };

    this.snapshots.verify(`snap-${sha}`, sha, true);

    res.writeHead(200, {
      "content-type": "application/json",
      "x-exact-sha": sha,
    });
    res.end(JSON.stringify(body));
  }
}
