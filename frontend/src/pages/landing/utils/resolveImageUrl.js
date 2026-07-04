/** Neutral inline SVG — never a solid brand-color block */
export const IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23f1f5f9' width='800' height='600'/%3E%3Cg fill='%23cbd5e1'%3E%3Cpath d='M120 420h560v40H120z'/%3E%3Cpath d='M200 180h400v240H200z' rx='8'/%3E%3Ccircle cx='400' cy='300' r='48'/%3E%3C/g%3E%3Ctext x='400' y='520' text-anchor='middle' fill='%2394a3b8' font-family='system-ui' font-size='20'%3EImage unavailable%3C/text%3E%3C/svg%3E";

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return path;
}

export function pickImage(images, index = 0) {
  if (!images?.length) return '';
  const item = images[index % images.length];
  return resolveImageUrl(item?.url || '');
}
