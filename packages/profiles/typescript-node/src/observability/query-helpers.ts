/**
 * Builds a VictoriaLogs LogSQL query filtered by worktree id.
 *
 * @param worktreeId - Worktree correlation id.
 * @param baseUrl - VictoriaLogs HTTP endpoint.
 * @returns Query URL for log retrieval.
 */
export function buildLogsQueryUrl(worktreeId: string, baseUrl = "http://localhost:9428"): string {
  return `${baseUrl}/select/logsql/query?query=worktreeId:${encodeURIComponent(worktreeId)}`;
}

/**
 * Builds a PromQL selector for VictoriaMetrics scoped to a worktree.
 *
 * @param worktreeId - Worktree correlation id.
 * @returns PromQL label selector.
 */
export function buildMetricsQuery(worktreeId: string): string {
  return `{worktreeId="${worktreeId}"}`;
}

/**
 * Builds a TraceQL query filtered by worktree id.
 *
 * @param worktreeId - Worktree correlation id.
 * @returns TraceQL query string.
 */
export function buildTracesQuery(worktreeId: string): string {
  return `{worktreeId="${worktreeId}"}`;
}
