/**
 * error-context.ts - Traefik Header & URL Error Mapping
 *
 * Captures HTTP status codes injected via Traefik error middleware headers,
 * query parameters, or URI paths (e.g., /404, /500, /502, /503, /504).
 */

export interface ErrorDetails {
  statusCode: number;
  title: string;
  subtitle: string;
  message: string;
  host: string;
  rayId: string;
  cluster: string;
  timestamp: string;
}

export const ERROR_DEFINITIONS: Record<
  number,
  { title: string; subtitle: string; message: string }
> = {
  404: {
    title: '404 - LOST IN THE HILLS',
    subtitle: 'Lost in the Hills',
    message: "We couldn't find the requested page on greaveslabs.io.",
  },
  500: {
    title: '500 - CLUSTER ENGINE FAULT',
    subtitle: 'Cluster Engine Fault',
    message: 'An unexpected platform error occurred.',
  },
  502: {
    title: '502 - BAD GATEWAY',
    subtitle: 'Bad Gateway',
    message: 'The upstream microservice failed to answer.',
  },
  503: {
    title: '503 - UNDER MAINTENANCE',
    subtitle: 'Under Maintenance',
    message: 'The platform team is cycling workloads.',
  },
  504: {
    title: '504 - GATEWAY TIMEOUT',
    subtitle: 'Gateway Timeout',
    message: 'Upstream node took too long to respond.',
  },
};

export const DEFAULT_ERROR = {
  title: 'PLATFORM ANOMALY',
  subtitle: 'Platform Anomaly',
  message: 'An unexpected response was encountered across the cluster.',
};

/**
 * Extracts the HTTP status code from URI path, query parameters, or Traefik headers.
 */
export function extractStatusCode(
  urlOrPath: string,
  headers?: Record<string, string>,
): number {
  // 1. Check custom Traefik headers first
  if (headers) {
    const headerCode =
      headers['x-code'] ||
      headers['X-Code'] ||
      headers['x-status-code'] ||
      headers['X-Status-Code'] ||
      headers['status'] ||
      headers['Status'];
    if (headerCode) {
      const parsed = parseInt(headerCode, 10);
      if (!isNaN(parsed) && parsed >= 100 && parsed <= 599) {
        return parsed;
      }
    }
  }

  // 2. Parse from URL / path
  let path = urlOrPath;
  let search = '';

  try {
    const url = new URL(urlOrPath, 'http://localhost');
    path = url.pathname;
    search = url.search;
  } catch {
    // If not a full URL, split path and query
    const parts = urlOrPath.split('?');
    path = parts[0] || '';
    search = parts[1] ? `?${parts[1]}` : '';
  }

  // Check query parameter (?code=404, ?status=502)
  if (search) {
    const params = new URLSearchParams(search);
    const codeParam = params.get('code') || params.get('status');
    if (codeParam) {
      const parsed = parseInt(codeParam, 10);
      if (!isNaN(parsed) && parsed >= 100 && parsed <= 599) {
        return parsed;
      }
    }
  }

  // Check path (e.g. /404, /502, /404.html)
  const pathMatch = path.match(/\b(404|500|502|503|504)\b/);
  if (pathMatch && pathMatch[1]) {
    return parseInt(pathMatch[1], 10);
  }

  // Check any 3-digit HTTP status pattern in path
  const genericMatch = path.match(/\/([1-5][0-9]{2})(?:\.html)?$/);
  if (genericMatch && genericMatch[1]) {
    return parseInt(genericMatch[1], 10);
  }

  // Default fallback if no code is present
  return 404;
}

/**
 * Generates an 8-character hex RayID
 */
export function generateRayId(): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Parses full error context with diagnostics.
 */
export function getErrorContext(
  urlOrPath: string,
  headers?: Record<string, string>,
  overrideHost?: string,
): ErrorDetails {
  const statusCode = extractStatusCode(urlOrPath, headers);
  const def = ERROR_DEFINITIONS[statusCode] || {
    title: `${statusCode} - ${DEFAULT_ERROR.title}`,
    subtitle: DEFAULT_ERROR.subtitle,
    message: DEFAULT_ERROR.message,
  };

  const rayId =
    (headers && (headers['cf-ray'] || headers['x-request-id'])) ||
    generateRayId();

  const host =
    overrideHost ||
    (typeof window !== 'undefined' && window.location.hostname) ||
    'k3s-worker-01';

  return {
    statusCode,
    title: def.title,
    subtitle: def.subtitle,
    message: def.message,
    host: host === 'localhost' || !host ? 'k3s-worker-01' : host,
    rayId,
    cluster: 'greaveslabs.io',
    timestamp: new Date().toISOString(),
  };
}
