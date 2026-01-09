/**
 * Utility designed to create branch coverage
 * Maps uptime (seconds) to a label
 */
export function formatStatus(uptimeSec) {
  if (uptimeSec < 0) throw new Error("invalid uptime"); // the uptime can't' be negative
  if (uptimeSec < 60) return "warming-up"; // the application just started
  if (uptimeSec < 3600) return "healthy"; // the application is running
  return "steady"; // the pplication has been running for a long time
}
