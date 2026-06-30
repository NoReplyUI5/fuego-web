// RFC 9727 — API Catalog, served as application/linkset+json (RFC 9264).
// Fuego exposes one public, unauthenticated API: GET /api/stats.
const SITE = 'https://fuego.qzz.io';

export default function handler(req, res) {
  const catalog = {
    linkset: [
      {
        anchor: `${SITE}/api/stats`,
        'service-doc': [
          { href: `${SITE}/status`, type: 'text/html', title: 'Fuego live status page' },
        ],
        status: [
          { href: `${SITE}/api/stats`, type: 'application/json', title: 'Live stats JSON (shards, players, totals)' },
        ],
      },
    ],
  };
  res.setHeader('Content-Type', 'application/linkset+json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(JSON.stringify(catalog, null, 2));
}
