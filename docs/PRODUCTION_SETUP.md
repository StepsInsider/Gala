# Gala / Pincus Lead Engine – Produktions-Setup

## Architektur

Google/SEO/Ads → lokale Landingpage → Leadformular → Netlify Function `create-lead` → Supabase → Pincus Work.

## Benötigte Netlify Environment Variables

- `SUPABASE_URL` – URL des Projekts `pincus-gala`
- `SUPABASE_SERVICE_ROLE_KEY` – ausschließlich als serverseitiges Netlify Secret

Keine dieser Variablen in Git committen.

## Supabase

Die Migration `supabase/migrations/001_lead_pipeline.sql` muss einmalig im vorgesehenen Pincus-Gala-Projekt ausgeführt werden. Sie ist absichtlich nicht automatisch gegen Produktion ausgeführt.

Die Tabelle `leads` bleibt über RLS für direkte öffentliche Zugriffe gesperrt. Die Netlify Function schreibt serverseitig über den Service-Role-Key.

## Storage

Die Function erwartet einen Storage-Bucket `lead-photos`. Der Bucket sollte nicht öffentlich beschreibbar sein. Uploads erfolgen serverseitig.

## Tracking

Unterstützt werden:

- `utm_source`
- `utm_campaign`
- `utm_term`
- `gclid`
- `fbclid`
- Landingpage

## Go-Live-Checkliste

- [ ] Supabase Migration ausführen
- [ ] `lead-photos` Bucket anlegen
- [ ] Netlify Secrets setzen
- [ ] Testlead mit echter E-Mail/Telefonnummer durchführen
- [ ] Foto-Upload testen
- [ ] Lead in Pincus Work prüfen
- [ ] Google Search Console einrichten
- [ ] Sitemap einreichen
- [ ] Google Ads Conversion-Tracking testen
- [ ] Datenschutz/Impressum final prüfen

## Sicherheit

Keine Service-Role-Keys, Passwörter oder privaten Zugangsdaten in GitHub speichern.
