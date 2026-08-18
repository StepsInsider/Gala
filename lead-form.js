const SUPABASE_URL = window.PINCUS_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.PINCUS_SUPABASE_ANON_KEY || '';

const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!status) return;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    status.textContent = 'Die Online-Anfrage ist noch nicht konfiguriert. Bitte hinterlegen Sie die Supabase-Konfiguration.';
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const params = new URLSearchParams(window.location.search);
  const payload = {
    ...data,
    source: 'organic_or_direct',
    landing_page: window.location.pathname,
    campaign: params.get('utm_campaign') || '',
    keyword: params.get('utm_term') || '',
    gclid: params.get('gclid') || '',
    fbclid: params.get('fbclid') || '',
    photo_urls: [],
  };

  status.textContent = 'Anfrage wird übermittelt …';
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_public_lead`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload }),
    });
    if (!response.ok) throw new Error(await response.text());
    form.reset();
    status.textContent = 'Vielen Dank. Ihre Anfrage wurde erfolgreich übermittelt.';
  } catch (error) {
    console.error(error);
    status.textContent = 'Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es später erneut.';
  }
});
