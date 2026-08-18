import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const services = [
  ['gartenbau', 'Gartenbau'],
  ['gartengestaltung', 'Gartengestaltung'],
  ['gartenpflege', 'Gartenpflege'],
  ['garten-neu-gestalten', 'Garten neu gestalten'],
  ['rollrasen', 'Rollrasen'],
  ['pflasterarbeiten', 'Pflasterarbeiten'],
  ['terrassenbau', 'Terrassenbau'],
  ['zaunbau', 'Zaunbau'],
  ['baumfaellung', 'Baumfällung'],
  ['baumpflege', 'Baumpflege'],
  ['heckenschnitt', 'Heckenschnitt'],
  ['erdarbeiten', 'Erdarbeiten'],
  ['drainage', 'Drainage und Entwässerung'],
  ['wurzelfraesen', 'Wurzelfräsen'],
  ['gartenwege', 'Gartenwege'],
];

const cities = [
  ['kamen', 'Kamen'],
  ['unna', 'Unna'],
  ['dortmund', 'Dortmund'],
  ['bergkamen', 'Bergkamen'],
  ['schwerte', 'Schwerte'],
  ['luenen', 'Lünen'],
  ['hamm', 'Hamm'],
  ['iserlohn', 'Iserlohn'],
];

const priority = new Set([
  'gartenbau-kamen', 'gartengestaltung-kamen', 'gartenpflege-kamen',
  'garten-neu-gestalten-kamen', 'rollrasen-kamen', 'pflasterarbeiten-kamen',
  'terrassenbau-kamen', 'zaunbau-kamen', 'baumfaellung-kamen',
  'gartenbau-unna', 'gartengestaltung-unna', 'gartenbau-dortmund',
  'gartengestaltung-dortmund', 'pflasterarbeiten-dortmund', 'gartenpflege-dortmund',
]);

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const page = (service, city, slug) => `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(service)} in ${escapeHtml(city)} | René Pincus</title>
  <meta name="description" content="${escapeHtml(service)} in ${escapeHtml(city)} und Umgebung. Persönliche Besichtigung, transparente Planung und Umsetzung aus einer Hand.">
  <link rel="canonical" href="https://gala-pincus.de/${slug}/">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
<header class="site-header"><a class="brand" href="/">René Pincus</a><a class="header-cta" href="#anfrage">Projekt anfragen</a></header>
<main>
<section class="hero">
  <p class="eyebrow">Garten- und Landschaftspflege · ${escapeHtml(city)}</p>
  <h1>${escapeHtml(service)} in ${escapeHtml(city)}</h1>
  <p class="lead">Professionelle Außenanlagen, persönliche Beratung und eine saubere Umsetzung – passend zu Ihrem Grundstück und Ihrem Vorhaben.</p>
  <a class="button" href="#anfrage">Kostenlose Besichtigung anfragen</a>
</section>
<section class="content">
  <h2>${escapeHtml(service)} mit einem Ansprechpartner</h2>
  <p>René Pincus unterstützt private und gewerbliche Auftraggeber in ${escapeHtml(city)} und der Region. Umfang und Ablauf werden nach einer individuellen Einschätzung vor Ort festgelegt.</p>
  <div class="grid">
    <article><h3>Persönliche Besichtigung</h3><p>Die örtlichen Gegebenheiten werden vor Beginn gemeinsam besprochen.</p></article>
    <article><h3>Aus einer Hand</h3><p>Planung und passende Arbeiten können zu einem abgestimmten Projekt zusammengeführt werden.</p></article>
    <article><h3>Echte Projektplanung</h3><p>Material, Fläche, Zugänglichkeit und gewünschter Zeitraum werden berücksichtigt.</p></article>
  </div>
</section>
<section class="content"><h2>Weitere Leistungen</h2><p>Je nach Projekt lassen sich unter anderem Gartengestaltung, Gartenpflege, Rollrasen, Pflasterarbeiten, Terrassenbau, Zaunbau, Baumarbeiten, Erdarbeiten und Entwässerung kombinieren.</p></section>
<section id="anfrage" class="lead-section">
  <div><p class="eyebrow">Projektanfrage</p><h2>Was möchten Sie umsetzen?</h2><p>Senden Sie die wichtigsten Eckdaten. Fotos können später ergänzt werden. Die Anfrage wird als Lead in Pincus Work erfasst, sobald die Supabase-Konfiguration hinterlegt ist.</p></div>
  <form id="lead-form">
    <input name="contact_name" required placeholder="Name">
    <input name="phone" placeholder="Telefon">
    <input name="email" type="email" placeholder="E-Mail">
    <input name="postcode" placeholder="PLZ">
    <input name="city" value="${escapeHtml(city)}" placeholder="Ort">
    <select name="service"><option>${escapeHtml(service)}</option><option>Gartengestaltung</option><option>Gartenpflege</option><option>Rollrasen</option><option>Pflasterarbeiten</option><option>Terrassenbau</option><option>Zaunbau</option><option>Baumfällung</option><option>Baumpflege</option><option>Erdarbeiten</option><option>Drainage</option><option>Sonstiges</option></select>
    <select name="project_size"><option value="">Projektgröße</option><option>unter 50 m²</option><option>50–100 m²</option><option>100–250 m²</option><option>250–500 m²</option><option>über 500 m²</option></select>
    <select name="desired_period"><option value="">Zeitraum</option><option>sofort</option><option>1–3 Monate</option><option>3–6 Monate</option><option>später</option></select>
    <textarea name="description" rows="5" placeholder="Kurzbeschreibung des Vorhabens"></textarea>
    <label class="consent"><input type="checkbox" required> Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage zu.</label>
    <button class="button" type="submit">Anfrage absenden</button>
    <p id="form-status" class="form-status" role="status"></p>
  </form>
</section>
<section class="content"><h2>Häufige Fragen</h2><details><summary>Was kostet ${escapeHtml(service)} in ${escapeHtml(city)}?</summary><p>Das hängt unter anderem von Fläche, Material, Zugänglichkeit und Leistungsumfang ab. Eine belastbare Einschätzung erfolgt nach den Projektinformationen und bei Bedarf nach einer Besichtigung.</p></details><details><summary>Kann ich mehrere Leistungen kombinieren?</summary><p>Ja. Gerade bei größeren Außenanlagen können mehrere Arbeiten zu einem gemeinsamen Projekt zusammengefasst werden.</p></details><details><summary>Kann ich Fotos zur Anfrage senden?</summary><p>Die Foto-Upload-Funktion wird im nächsten technischen Schritt an den Lead-Funnel angebunden.</p></details></section>
</main>
<footer><p>René Pincus Baum- &amp; Landschaftspflege · Kamen · Unna · Dortmund und Umgebung</p></footer>
<script src="/lead-form.js" defer></script>
</body></html>`;

const slugs = [];
for (const [serviceSlug, service] of services) {
  for (const [citySlug, city] of cities) {
    const slug = `${serviceSlug}-${citySlug}`;
    slugs.push(slug);
    const file = join(process.cwd(), slug, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page(service, city, slug));
  }
}

const sitemap = ['https://gala-pincus.de/', ...slugs.map((slug) => `https://gala-pincus.de/${slug}/`)]
  .map((url) => `<url><loc>${url}</loc></url>`).join('');
await writeFile(join(process.cwd(), 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`);
await writeFile(join(process.cwd(), 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://gala-pincus.de/sitemap.xml\n');
