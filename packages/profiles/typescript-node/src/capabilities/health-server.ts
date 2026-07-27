import { createServer, type Server } from "node:http";

/** Starts HTTP server with /health returning { status: "ok" }. */
export function createHealthServer(): Server {
  return createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    response.writeHead(404);
    response.end();
  });
}
