import { describe, it, expect } from 'vitest';
import {
  getErrorContext,
  extractStatusCode,
  ERROR_DEFINITIONS,
  DEFAULT_ERROR,
} from '../../src/web/error-context';

describe('ErrorContext & Traefik Code Parsing', () => {
  describe('Standard HTTP Error Code Mappings', () => {
    it('validates that URL /404 loads the "Lost in the Hills" message', () => {
      const context = getErrorContext('/404');
      expect(context.statusCode).toBe(404);
      expect(context.title).toBe(ERROR_DEFINITIONS[404].title);
      expect(context.subtitle).toBe('Lost in the Hills');
      expect(context.message).toContain("We couldn't find the requested page");
    });

    it('validates that URL /502 loads "Bad Gateway"', () => {
      const context = getErrorContext('https://bins.greaveslabs.io/502');
      expect(context.statusCode).toBe(502);
      expect(context.title).toBe(ERROR_DEFINITIONS[502].title);
      expect(context.subtitle).toBe('Bad Gateway');
      expect(context.message).toBe('The upstream microservice failed to answer.');
    });

    it('validates 500 Cluster Engine Fault', () => {
      const context = getErrorContext('/500');
      expect(context.statusCode).toBe(500);
      expect(context.subtitle).toBe('Cluster Engine Fault');
      expect(context.message).toBe('An unexpected platform error occurred.');
    });

    it('validates 503 Under Maintenance', () => {
      const context = getErrorContext('/503.html');
      expect(context.statusCode).toBe(503);
      expect(context.subtitle).toBe('Under Maintenance');
      expect(context.message).toBe('The platform team is cycling workloads.');
    });

    it('validates 504 Gateway Timeout', () => {
      const context = getErrorContext('/504');
      expect(context.statusCode).toBe(504);
      expect(context.subtitle).toBe('Gateway Timeout');
      expect(context.message).toBe('Upstream node took too long to respond.');
    });
  });

  describe('Unmapped HTTP Code Fallbacks', () => {
    it('tests fallback to generic error when an unmapped HTTP code is provided', () => {
      const context = getErrorContext('/418'); // I'm a teapot
      expect(context.statusCode).toBe(418);
      expect(context.title).toBe(`418 - ${DEFAULT_ERROR.title}`);
      expect(context.subtitle).toBe(DEFAULT_ERROR.subtitle);
      expect(context.message).toBe(DEFAULT_ERROR.message);
    });

    it('defaults to 404 when no code is present in URL or query', () => {
      const context = getErrorContext('/');
      expect(context.statusCode).toBe(404);
      expect(context.subtitle).toBe('Lost in the Hills');
    });
  });

  describe('Query Parameters & Traefik Headers Parsing', () => {
    it('extracts status from query parameter ?code=503', () => {
      const code = extractStatusCode('https://greaveslabs.io/errors?code=503');
      expect(code).toBe(503);
    });

    it('extracts status from query parameter ?status=500', () => {
      const code = extractStatusCode('/error?status=500');
      expect(code).toBe(500);
    });

    it('prioritizes Traefik headers over URL path', () => {
      const headers = { 'x-code': '502' };
      const code = extractStatusCode('/404', headers);
      expect(code).toBe(502);
    });

    it('extracts X-Status-Code header', () => {
      const headers = { 'X-Status-Code': '504' };
      const code = extractStatusCode('/', headers);
      expect(code).toBe(504);
    });

    it('handles invalid or non-numeric query parameters gracefully', () => {
      const codeInvalid = extractStatusCode('/errors?code=abc');
      expect(codeInvalid).toBe(404);

      const codeOutOfRange = extractStatusCode('/errors?code=9999');
      expect(codeOutOfRange).toBe(404);
    });

    it('parses malformed URL string fallback', () => {
      const code = extractStatusCode('malformed:path/502');
      expect(code).toBe(502);
    });

    it('extracts Status header', () => {
      const headers = { status: '503' };
      const code = extractStatusCode('/', headers);
      expect(code).toBe(503);
    });
  });

  describe('Telemetry Diagnostics', () => {
    it('includes cluster name, timestamp, and RayID', () => {
      const context = getErrorContext('/404', { 'cf-ray': 'ray-xyz-123' }, 'k3s-control-plane');
      expect(context.cluster).toBe('greaveslabs.io');
      expect(context.host).toBe('k3s-control-plane');
      expect(context.rayId).toBe('ray-xyz-123');
      expect(context.timestamp).toBeDefined();
    });

    it('generates random hex RayID if header is not present', () => {
      const context = getErrorContext('/404');
      expect(context.rayId).toMatch(/^[0-9a-f]{8}$/);
    });

    it('falls back to k3s-worker-01 when host is localhost or empty', () => {
      const context = getErrorContext('/404', undefined, 'localhost');
      expect(context.host).toBe('k3s-worker-01');

      const contextEmpty = getErrorContext('/404', undefined, '');
      expect(contextEmpty.host).toBe('k3s-worker-01');
    });
  });
});
