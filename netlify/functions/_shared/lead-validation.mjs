export const normalize = (value) => String(value ?? '').trim();

export const requiredFields = (form) => {
  const contactName = normalize(form.get('contact_name'));
  const service = normalize(form.get('service'));
  if (!contactName) return 'contact_name is required';
  if (!service) return 'service is required';
  return null;
};

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
export const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const allowedFile = (file) => {
  if (!file || typeof file === 'string' || !file.size) return true;
  return ALLOWED_TYPES.has(file.type) && file.size <= MAX_FILE_SIZE;
};

export const companyId = () => normalize(process.env.PINCUS_COMPANY_ID);
