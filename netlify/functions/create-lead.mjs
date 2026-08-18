const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (statusCode, body) => new Response(JSON.stringify(body), {
  status: statusCode,
  headers: { ...headers, 'Content-Type': 'application/json' },
});

const supabaseRequest = async (path, options = {}) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response;
};

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response('', { status: 204, headers });
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: 'Lead service is not configured' });
  }

  try {
    const form = await request.formData();
    const required = ['contact_name', 'service'];
    for (const field of required) {
      if (!String(form.get(field) || '').trim()) return json(400, { error: `${field} is required` });
    }

    const companyResponse = await supabaseRequest('companies?select=id&name=eq.Pincus%20Work&limit=1');
    const companies = await companyResponse.json();
    if (!companies[0]?.id) return json(500, { error: 'Pincus company is not configured' });

    const leadResponse = await supabaseRequest('leads', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        company_id: companies[0].id,
        status: 'neu',
        service: String(form.get('service') || '').trim(),
        city: String(form.get('city') || '').trim() || null,
        postcode: String(form.get('postcode') || '').trim() || null,
        address: String(form.get('address') || '').trim() || null,
        project_size: String(form.get('project_size') || '').trim() || null,
        desired_period: String(form.get('desired_period') || '').trim() || null,
        description: String(form.get('description') || '').trim() || null,
        contact_name: String(form.get('contact_name') || '').trim(),
        phone: String(form.get('phone') || '').trim() || null,
        email: String(form.get('email') || '').trim() || null,
        source: String(form.get('source') || 'organic_or_direct'),
        landing_page: String(form.get('landing_page') || '').trim() || null,
        campaign: String(form.get('campaign') || '').trim() || null,
        keyword: String(form.get('keyword') || '').trim() || null,
        gclid: String(form.get('gclid') || '').trim() || null,
        fbclid: String(form.get('fbclid') || '').trim() || null,
      }),
    });
    const [lead] = await leadResponse.json();

    const photoUrls = [];
    const files = form.getAll('photos').filter((item) => typeof item !== 'string');
    for (const file of files.slice(0, 8)) {
      if (!file.size) continue;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100);
      const path = `${lead.id}/${crypto.randomUUID()}-${safeName}`;
      const upload = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/lead-photos/${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'false',
        },
        body: await file.arrayBuffer(),
      });
      if (!upload.ok) throw new Error(await upload.text());
      photoUrls.push(path);
    }

    if (photoUrls.length) {
      await supabaseRequest(`leads?id=eq.${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ photo_urls: photoUrls, updated_at: new Date().toISOString() }),
      });
    }

    return json(200, { id: lead.id });
  } catch (error) {
    console.error(error);
    return json(500, { error: 'Lead could not be created' });
  }
};
