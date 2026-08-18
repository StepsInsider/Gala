const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');

if (form && !form.querySelector('input[name="photos"]')) {
  const label = document.createElement('label');
  label.textContent = 'Projektfotos (optional, bis zu 8 Bilder)';
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'photos';
  input.accept = 'image/jpeg,image/png,image/webp';
  input.multiple = true;
  label.appendChild(input);
  const consent = form.querySelector('.consent');
  form.insertBefore(label, consent || null);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!status) return;

  const formData = new FormData(form);
  const params = new URLSearchParams(window.location.search);
  formData.set('source', params.get('utm_source') || 'organic_or_direct');
  formData.set('landing_page', window.location.pathname);
  formData.set('campaign', params.get('utm_campaign') || '');
  formData.set('keyword', params.get('utm_term') || '');
  formData.set('gclid', params.get('gclid') || '');
  formData.set('fbclid', params.get('fbclid') || '');

  status.textContent = 'Anfrage wird übermittelt …';
  try {
    const response = await fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Lead konnte nicht erstellt werden');
    form.reset();
    status.textContent = 'Vielen Dank. Ihre Anfrage wurde erfolgreich übermittelt.';
  } catch (error) {
    console.error(error);
    status.textContent = 'Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es später erneut.';
  }
});
