/**
 * Universal Asset URL Resolver for Localhost, Vercel, and GitHub Pages
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (
    path.startsWith('http://') || 
    path.startsWith('https://') || 
    path.startsWith('data:') || 
    path.startsWith('blob:')
  ) {
    return path;
  }

  const envBase = (typeof import.meta !== 'undefined' && (import.meta as any).env) 
    ? (import.meta as any).env.BASE_URL 
    : './';
  const base = envBase || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  // If path already starts with the normalizedBase (e.g. /slide-training-design/assets/...)
  if (path.startsWith(normalizedBase)) {
    return path;
  }

  // If path starts with base without leading slash (e.g. slide-training-design/assets/...)
  const trimmedBase = normalizedBase.replace(/^\/+|\/+$/g, '');
  if (trimmedBase) {
    if (path.startsWith(`/${trimmedBase}/`)) {
      return path;
    }
    if (path.startsWith(`${trimmedBase}/`)) {
      return `/${path}`;
    }
  }

  // Strip leading slash before prepending normalizedBase
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${cleanPath}`;
};
