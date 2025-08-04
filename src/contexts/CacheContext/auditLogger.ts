interface AuditLogEntry {
  timestamp: number;
  action: 'UPDATE' | 'DELETE' | 'INVALIDATE';
  key: string;
  oldValue?: unknown;
  newValue?: unknown;
  ttl?: number;
  source?: string;
}

const MAX_LOG_ENTRIES = 1000;
const log: AuditLogEntry[] = [];

/**
 * Logs a cache modification event
 */
function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const logEntry = {
    timestamp: Date.now(),
    ...entry,
  };

  // Add to the beginning of the log (most recent first)
  log.unshift(logEntry);

  // Trim log if it gets too large
  if (log.length > MAX_LOG_ENTRIES) {
    log.length = MAX_LOG_ENTRIES;
  }

  // In production, you might want to send this to a logging service
  console.debug('[Cache Audit]', logEntry);
  
  return logEntry;
}

/**
 * Gets recent audit log entries
 */
function getAuditLog(limit: number = 50): AuditLogEntry[] {
  return log.slice(0, limit);
}

export { logAuditEvent, getAuditLog };
export type { AuditLogEntry };
