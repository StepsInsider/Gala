import test from 'node:test';
import assert from 'node:assert/strict';
import { allowedFile, companyId, requiredFields } from '../netlify/functions/_shared/lead-validation.mjs';

test('requires contact name and service', () => {
  const form = new FormData();
  form.set('contact_name', 'Max Mustermann');
  assert.equal(requiredFields(form), 'service is required');
  form.set('service', 'Rollrasen');
  assert.equal(requiredFields(form), null);
});

test('accepts supported image types within size limit', () => {
  assert.equal(allowedFile(new File(['x'], 'x.jpg', { type: 'image/jpeg' })), true);
  assert.equal(allowedFile(new File(['x'], 'x.txt', { type: 'text/plain' })), false);
});

test('company id comes only from server environment', () => {
  const previous = process.env.PINCUS_COMPANY_ID;
  process.env.PINCUS_COMPANY_ID = 'company-test';
  assert.equal(companyId(), 'company-test');
  if (previous === undefined) delete process.env.PINCUS_COMPANY_ID;
  else process.env.PINCUS_COMPANY_ID = previous;
});
