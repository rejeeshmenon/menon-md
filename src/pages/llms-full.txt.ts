import type { APIRoute } from 'astro';
import { cv } from '../lib/cv';
import { renderCvMarkdown } from '../lib/markdown';

/** The full CV as markdown, from the same serializer the chat is grounded on. */
export const GET: APIRoute = () =>
  new Response(renderCvMarkdown(cv), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
