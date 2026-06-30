// ── Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ── Active nav link
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  if (a.href === location.href || a.pathname === location.pathname) {
    a.classList.add('active');
  }
});

// ── Reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Count-up animation
function countUp(el, target, duration = 1400) {
  const isFloat = !Number.isInteger(target);
  const start = performance.now();
  const from = 0;
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = from + (target - from) * ease;
    el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

// ── Format helpers
function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n?.toLocaleString() ?? '--';
}
function parsePing(s) { return parseInt(s ?? '0'); }

// ── Vercel Web Analytics (static-site loader; enable Web Analytics in the Vercel dashboard)
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
(function () {
  const s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
})();

// ── WebMCP — expose site tools to AI agents (https://webmachinelearning.github.io/webmcp/)
if (navigator.modelContext?.provideContext) {
  try {
    navigator.modelContext.provideContext({
      tools: [
        {
          name: 'getStats',
          description: 'Get live Mesuic Discord music bot stats: total servers, users, songs played, commands used, active players, average ping, and per-shard / Lavalink node details.',
          inputSchema: { type: 'object', properties: {}, additionalProperties: false },
          async execute() {
            const res = await fetch('/api/stats');
            const d = await res.json();
            const shards = d.stats ?? [];
            const summary = {
              servers: shards.reduce((a, s) => a + (s.client?.guilds ?? 0), 0),
              users: shards.reduce((a, s) => a + (s.client?.users ?? 0), 0),
              songsPlayed: d.songsPlayed?.total ?? 0,
              commandsUsed: d.commandsUsed?.total ?? 0,
              activePlayers: shards.reduce((a, s) => a + (s.node?.[0]?.players?.client?.playing ?? 0), 0),
              shardCount: shards.length,
              stale: !!d._stale,
            };
            return { content: [{ type: 'text', text: JSON.stringify(summary) }] };
          },
        },
      ],
    });
  } catch (e) { /* WebMCP unavailable or rejected — non-fatal */ }
}
