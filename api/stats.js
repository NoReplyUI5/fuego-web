let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export default async function handler(req, res) {
  const now = Date.now();
  const live = 'live' in req.query;

  if (!live && cache && (now - cacheTime) < CACHE_TTL) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    res.setHeader('Surrogate-Control', 'public, max-age=300');
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('X-Cache-Age', Math.floor((now - cacheTime) / 1000) + 's');
    return res.status(200).json(cache);
  }

  try {
    const response = await fetch('http://44.194.24.194:3000/stats');
    const data = await response.json();

    if (!live) {
      cache = data;
      cacheTime = now;
    }

    res.setHeader('Cache-Control', live ? 'no-store, no-cache, must-revalidate' : 'public, s-maxage=300, stale-while-revalidate=60');
    res.setHeader('Surrogate-Control', live ? 'no-store' : 'public, max-age=300');
    res.setHeader('X-Cache', live ? 'LIVE' : 'MISS');
    res.setHeader('X-Cache-Age', '0s');
    return res.status(200).json(data);
  } catch (err) {
    if (cache) {
      res.setHeader('X-Cache', 'STALE');
      return res.status(200).json({ ...cache, _stale: true });
    }
    return res.status(503).json({ error: true, message: 'Stats unavailable' });
  }
}
