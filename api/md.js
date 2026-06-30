// Markdown for Agents — content negotiation.
// vercel.json rewrites requests carrying `Accept: text/markdown` here (per page).
// HTML stays the default for browsers; agents get clean markdown.
import PAGES from '../lib/pages-md.js';

export default function handler(req, res) {
  const key = (req.query.path || 'home').toString();
  const md = PAGES[key] ?? PAGES.home;
  // Rough token estimate (~4 chars/token) for x-markdown-tokens.
  const tokens = Math.ceil(md.length / 4);
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('x-markdown-tokens', String(tokens));
  res.setHeader('Vary', 'Accept');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(md);
}
