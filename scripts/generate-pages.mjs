import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const locations = new Map([
  ['kamen', 'Kamen'], ['dortmund', 'Dortmund'], ['unna', 'Unna'],
  ['bergkamen', 'Bergkamen'], ['schwerte', 'Schwerte'], ['hamm', 'Hamm'],
  ['luenen', 'Lünen'], ['iserlohn', 'Iserlohn'],
]);

const services = new Map([
  ['gartenbau', 'Garten- & Landschaftsbau'], ['rollrasen', 'Rollrasen'],
  ['pflasterarbeiten', 'Pflasterarbeiten'], ['terrassenbau', 'Terrassenbau'],
  ['zaunbau', 'Zaunbau'], ['baumfaellung', 'Baumfällarbeiten'],
  ['baumpflege', 'Baumpflege'], ['wurzelfraesen', 'Wurzelfräsen'],
  ['erdarbeiten', 'Erdarbeiten'], ['drainage', 'Drainage & Entwässerung'],
  ['gartenpflege', 'Gartenpflege'], ['sturmschaeden', 'Sturmschadenbeseitigung'],
  ['schuettgut', 'Schüttgut'], ['entsorgung', 'Entsorgung'], ['poolbau', 'Poolbau'],
]);

const priority = [
  ['gartenbau', 'kamen'], ['gartenbau', 'dortmund'], ['gartenbau', 'unna'],
  ['rollrasen', 'kamen'], ['rollrasen', 'dortmund'], ['rollrasen', 'unna'],
  ['pflasterarbeiten', 'kamen'], ['pflasterarbeiten', 'dortmund'], ['pflasterarbeiten', 'unna'],
  ['terrassenbau', 'kamen'], ['terrassenbau', 'dortmund'], ['terrassenbau', 'unna'],
  ['zaunbau', 'kamen'], ['zaunbau', 'dortmund'], ['zaunbau', 'unna'],
  ['baumfaellung', 'kamen'], ['baumfaellung', 'dortmund'], ['baumfaellung', 'unna'],
  ['baumpflege', 'kamen'], ['baumpflege', 'dortmund'], ['baumpflege', 'unna'],
  ['wurzelfraesen', 'kamen'], ['wurzelfraesen', 'dortmund'], ['wurzelfraesen', 'unna'],
  ['erdarbeiten', 'kamen'], ['erdarbeiten', 'dortmund'], ['erdarbeiten', 'unna'],
  ['drainage', 'kamen'], ['drainage', 'dortmund'], ['drainage', 'unna'],
  ['gartenpflege', 'kamen'], ['gartenpflege', 'dortmund'], ['gartenpflege', 'unna'],
  ['sturmschaeden', 'kamen'], ['sturmschaeden', 'dortmund'],
  ['schuettgut', 'kamen'], ['schuettgut', 'dortmund'],
  ['entsorgung', 'kamen'], ['entsorgung', 'dortmund'],
  ['poolbau', 'kamen'], ['poolbau', 'dortmund'],
  ['gartenbau', 'bergkamen'], ['gartenbau', 'schwerte'], ['gartenbau', 'hamm'],
  ['gartenbau', 'luenen'], ['gartenbau', 'iserlohn'], ['rollrasen', 'bergkamen'],
  ['pflasterarbeiten', 'bergkamen'], ['baumfaellung', 'bergkamen'], ['baumpflege', 'bergkamen'],
];

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const page = (service, city, slug) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(service)} in ${escapeHtml(city)} | René Pincus</title>
<meta name="description" content="${escapeHtml(service)} in ${escapeHtml(city)} und Umgebung. Persönliche Beratung, transparente Planung und Umsetzung aus einer Hand.">
<link rel="canonical" href="https://gala-pincus.de/${slug}/"><link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: `${service} in ${city}`, provider: { '@type': 'LocalBusiness', name: 'René Pincus Baum- & Landschaftspflege', url: 'https://gala-pincus.de/' }, areaServed: { '@type': 'City', name: city } })}</script></head>
<body><header class="site-header"><a class="brand" href="/">René Pincus</a><a class="header-cta" href="#anfrage">Projekt anfragen</a></header><main>
<section class="hero"><p class="eyebrow">Garten- und Landschaftspflege · ${escapeHtml(city)}</p><h1>${escapeHtml(service)} in ${escapeHtml(city)}</h1><p class="lead">René Pincus plant und realisiert Außenanlagen für Privatkunden, Unternehmen und öffentliche Flächen in ${escapeHtml(city)} und Umgebung.</p><a class="button" href="#anfrage">Kostenlos &amp; unverbindlich anfragen</a></section>
<section class="content"><h2>${escapeHtml(service)} mit persönlicher Beratung</h2><p>Von der ersten Besichtigung bis zur Ausführung werden Projektumfang, Materialien, Zugänglichkeit und gewünschter Zeitraum gemeinsam abgestimmt. Der eigene Fuhrpark und modernes Fachgerät ermöglichen eine effiziente Umsetzung aus einer Hand.</p><div class="grid"><article><h3>Persönliche Besichtigung</h3><p>Die örtlichen Gegebenheiten und Ihr konkretes Vorhaben stehen im Mittelpunkt der Planung.</p></article><article><h3>Transparentes Angebot</h3><p>Leistungsumfang und Ausführung werden nachvollziehbar abgestimmt.</p></article><article><h3>Regional verfügbar</h3><p>Kamen, Unna, Dortmund und die umliegenden Einsatzgebiete werden direkt bedient.</p></article></div></section>
<section class="content"><h2>Weitere Leistungen für Ihr Projekt</h2><p>Je nach Vorhaben lassen sich ${escapeHtml(service)}, Gartengestaltung, Gartenpflege, Rollrasen, Pflasterarbeiten, Terrassenbau, Zaunbau, Baumarbeiten, Erdarbeiten und Entwässerung sinnvoll kombinieren.</p></section>
<section id="anfrage" class="lead-section"><div><p class="eyebrow">Projektanfrage</p><h2>Was möchten Sie umsetzen?</h2><p>Senden Sie die wichtigsten Eckdaten. Ihre Anfrage wird für die weitere Bearbeitung als Lead erfasst.</p></div><form id="lead-form"><input name="contact_name" required placeholder="Name"><input name="phone" placeholder="Telefon"><input name="email" type="email" placeholder="E-Mail"><input name="postcode" placeholder="PLZ"><input name="city" value="${escapeHtml(city)}" placeholder="Ort"><select name="service"><option>${escapeHtml(service)}</option><option>Gartengestaltung</option><option>Gartenpflege</option><option>Rollrasen</option><option>Pflasterarbeiten</option><option>Terrassenbau</option><option>Zaunbau</option><option>Baumfällarbeiten</option><option>Baumpflege</option><option>Erdarbeiten</option><option>Drainage</option><option>Sonstiges</option></select><select name="project_size"><option value="">Projektgröße</option><option>unter 50 m²</option><option>50–100 m²</option><option>100–250 m²</option><option>250–500 m²</option><option>über 500 m²</option></select><select name="desired_period"><option value="">Zeitraum</option><option>sofort</option><option>1–3 Monate</option><option>3–6 Monate</option><option>später</option></select><textarea name="description" rows="5" placeholder="Kurzbeschreibung des Vorhabens"></textarea><label class="consent"><input type="checkbox" name="consent" required> Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu.</label><button class="button" type="submit">Anfrage absenden</button><p id="form-status" class="form-status" role="status"></p></form></section>
<section class="content"><h2>Häufige Fragen</h2><details><summary>Was kostet ${escapeHtml(service)} in ${escapeHtml(city)}?</summary><p>Das hängt von Umfang, Fläche, Material, Zugänglichkeit und Ausführung ab. Eine belastbare Einschätzung erfolgt anhand Ihrer Projektangaben und bei Bedarf nach einer Besichtigung.</p></details><details><summary>Kann ich mehrere Leistungen kombinieren?</summary><p>Ja. Viele Außenprojekte verbinden beispielsweise Erdarbeiten, Entwässerung, Pflasterung, Terrassenbau oder Pflegearbeiten.</p></details></section></main><footer><p>René Pincus Baum- &amp; Landschaftspflege · Wasserkurlerstr. 33 · 59174 Kamen</p><p>Kamen · Unna · Dortmund · Bergkamen · Schwerte · Hamm · Lünen · Iserlohn</p></footer><script src="/config.js"></script><script src="/lead-form.js" defer></script></body></html>`;

const slugs = [];
for (const [serviceSlug, citySlug] of priority) {
  const service = services.get(serviceSlug); const city = locations.get(citySlug);
  if (!service || !city) throw new Error(`Unknown SEO combination: ${serviceSlug}/${citySlug}`);
  const slug = `${serviceSlug}-${citySlug}`; slugs.push(slug);
  const file = join(process.cwd(), slug, 'index.html'); await mkdir(dirname(file), { recursive: true }); await writeFile(file, page(service, city, slug));
}
const sitemap = ['https://gala-pincus.de/', ...slugs.map((slug) => `https://gala-pincus.de/${slug}/`)].map((url) => `<url><loc>${url}</loc></url>`).join('');
await writeFile(join(process.cwd(), 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`);
await writeFile(join(process.cwd(), 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://gala-pincus.de/sitemap.xml\n');
