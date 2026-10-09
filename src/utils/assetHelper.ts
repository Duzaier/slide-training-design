/**
 * Universal Asset URL Resolver for Localhost, Vercel, and GitHub Pages
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const envBase = (typeof import.meta !== 'undefined' && (import.meta as any).env) 
    ? (import.meta as any).env.BASE_URL 
    : './';
  const base = envBase || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${cleanPath}`;
};
