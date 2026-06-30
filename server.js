const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const cfg = require('./config');

const app = express();
app.use(cors());

// ── Redis helpers (Upstash REST API)
const redisHeaders = { Authorization: `Bearer ${cfg.redis.token}` };

async function redisGet(key) {
  const { data } = await axios.get(`${cfg.redis.url}/get/${key}`, { headers: redisHeaders });
  return data.result ? JSON.parse(data.result) : null;
}
async function redisSet(key, value, ttl) {
  await axios.get(`${cfg.redis.url}/set/${key}/${encodeURIComponent(JSON.stringify(value))}/ex/${ttl}`, { headers: redisHeaders });
}
async function redisTtl(key) {
  const { data } = await axios.get(`${cfg.redis.url}/ttl/${key}`, { headers: redisHeaders });
  return data.result ?? 0;
}

// ── Turso helpers (libsql HTTP API)
const tursoHeaders = { Authorization: `Bearer ${cfg.turso.token}`, 'Content-Type': 'application/json' };
const tursoUrl = `${cfg.turso.url}/v2/pipeline`;

async function tursoExec(sql, args = []) {
  const { data } = await axios.post(tursoUrl, {
    requests: [{ type: 'execute', stmt: { sql, args: args.map(v => ({ type: 'text', value: String(v) })) } }, { type: 'close' }]
  }, { headers: tursoHeaders });
  return data.results?.[0]?.response?.result;
}

async function initDB() {
  await tursoExec(`CREATE TABLE IF NOT EXISTS stats_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    fetched_at INTEGER NOT NULL
  )`);
}

// ── /api/stats: Redis → upstream → Turso fallback
app.get('/api/stats', async (req, res) => {
  const live = 'live' in req.query;

  // 1. Redis cache (shared, 5 min) — skip if ?live
  if (!live) {
    try {
      const cached = await redisGet('mesuic:stats');
      if (cached) {
        return res.set({
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          'X-Cache': 'HIT',
        }).json(cached);
      }
    } catch (e) { console.error('Redis read:', e.message); }
  }

  // 2. Fetch fresh
  try {
    const { data } = await axios.get(cfg.statsUpstream);
    const payload = { ...data, _fetchedAt: Date.now() };

    if (!live) {
      try { await redisSet('mesuic:stats', payload, cfg.cacheTtl); } catch (e) { console.error('Redis write:', e.message); }
      try {
        await tursoExec('INSERT INTO stats_snapshots (data, fetched_at) VALUES (?, ?)', [JSON.stringify(payload), Date.now()]);
        await tursoExec('DELETE FROM stats_snapshots WHERE id NOT IN (SELECT id FROM stats_snapshots ORDER BY fetched_at DESC LIMIT 288)');
      } catch (e) { console.error('Turso write:', e.message); }
    }

    return res.set({ 'Cache-Control': live ? 'no-store, no-cache, must-revalidate' : 'public, s-maxage=300, stale-while-revalidate=60', 'Surrogate-Control': 'no-store', 'Pragma': live ? 'no-cache' : undefined, 'X-Cache': live ? 'LIVE' : 'MISS' }).json(payload);
  } catch {
    // 3. Turso stale fallback
    try {
      const result = await tursoExec('SELECT data FROM stats_snapshots ORDER BY fetched_at DESC LIMIT 1');
      if (result?.rows?.length) {
        const stale = JSON.parse(result.rows[0][0]);
        return res.set('X-Cache', 'STALE').json({ ...stale, _stale: true });
      }
    } catch (e) { console.error('Turso read:', e.message); }
    res.status(503).json({ error: true, message: 'Stats unavailable' });
  }
});

// ── Agent discovery: API catalog (RFC 9727) + Link headers (RFC 8288)
app.get('/.well-known/api-catalog', (_, res) => {
  res.set('Content-Type', 'application/linkset+json');
  res.send(JSON.stringify({
    linkset: [{
      anchor: `${cfg.siteUrl}/api/stats`,
      'service-doc': [{ href: `${cfg.siteUrl}/status`, type: 'text/html', title: 'Mesuic live status page' }],
      status: [{ href: `${cfg.siteUrl}/api/stats`, type: 'application/json', title: 'Live stats JSON (shards, players, totals)' }],
    }],
  }, null, 2));
});
const LINK_HEADER = '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </status>; rel="service-doc"; type="text/html"';

// Markdown for Agents — Accept: text/markdown negotiation (hand-written per page).
const PAGES_MD = require('./lib/pages-md');
const MD_KEY = { '/': 'home', '/status': 'status', '/terms': 'terms', '/privacy': 'privacy' };

['/', '/status', '/terms', '/privacy'].forEach(route => {
  app.get(route, (req, res, next) => {
    res.set('Link', LINK_HEADER);
    res.set('Vary', 'Accept');
    if ((req.headers.accept || '').includes('text/markdown')) {
      const md = PAGES_MD[MD_KEY[route]];
      return res.set({ 'Content-Type': 'text/markdown; charset=utf-8', 'x-markdown-tokens': String(Math.ceil(md.length / 4)) }).send(md);
    }
    next();
  });
});

// ── Robots + Sitemap
app.get('/robots.txt', (_, res) => res.sendFile(path.join(__dirname, 'public', 'robots.txt')));
app.get('/sitemap.xml', (_, res) => {
  const now = new Date().toISOString().split('T')[0];
  const urls = ['/', '/status', '/terms', '/privacy'].map(p => `
  <url><loc>${cfg.siteUrl}${p}</loc><lastmod>${now}</lastmod><changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`).join('');
  res.set('Content-Type', 'application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`);
});

// ── Redirects
app.get('/invite',  (_, res) => res.redirect('https://discord.com/oauth2/authorize?client_id=1157589891287367730&permissions=274914995289&response_type=code&redirect_uri=https%3A%2F%2Fdiscord.gg%2FfBZ7DDZRfW&integration_type=0&scope=bot+applications.commands+guilds.join'));
app.get('/support', (_, res) => res.redirect('https://discord.gg/9evPZjMpnR'));
app.get('/vote',    (_, res) => res.redirect('https://top.gg/bot/1157589891287367730/vote'));

// ── Static + pages
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/cdn',    express.static(path.join(__dirname, 'files')));
Object.entries({ '/': 'index', '/status': 'status', '/terms': 'terms', '/privacy': 'privacy' }).forEach(([route, file]) => {
  app.get(route, (_, res) => res.sendFile(path.join(__dirname, 'public', `${file}.html`)));
});

initDB().then(() => app.listen(cfg.port, () => console.log(`🎵 Mesuic running → http://localhost:${cfg.port}`))).catch(console.error);
