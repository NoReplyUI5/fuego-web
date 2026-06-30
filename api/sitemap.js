const SITE = 'https://fuego.qzz.io';
const PAGES = ['/', '/status', '/terms', '/privacy'];

export default function handler(req, res) {
  const now = new Date().toISOString().split('T')[0];
  const urls = PAGES.map(p => `
  <url><loc>${SITE}${p}</loc><lastmod>${now}</lastmod><changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`).join('');
  res.setHeader('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`);
}
