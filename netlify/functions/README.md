# Lead function deployment contract

Required Netlify environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PINCUS_COMPANY_ID`

Optional:

- `LEAD_ALLOWED_ORIGIN` — exact public origin allowed by CORS. Defaults to `*` for development; set this in production.
- `LEAD_MAX_FILE_BYTES` — maximum size per uploaded image. Defaults to 10 MiB.

`SUPABASE_SERVICE_ROLE_KEY` must remain server-side and must never be placed in `config.js`, HTML, JavaScript shipped to the browser, GitHub, or other public assets.
