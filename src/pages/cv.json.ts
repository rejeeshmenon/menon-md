import type { APIRoute } from 'astro';
import { cv } from '../lib/cv';
import { buildJsonResume } from '../lib/jsonresume';

/** JSON Resume (https://jsonresume.org/schema) generated from cv.yaml. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildJsonResume(cv), null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
