export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send(
    'User-agent: *\n' +
    'Content-Signal: search=yes, ai-train=yes, ai-input=yes\n' +
    'Allow: /\n\n' +
    'Sitemap: https://mesuic.qzz.io/sitemap.xml\n'
  );
}
