/**
 * Global application runtime configuration.
 * Supports decoupling website code from external assets repository (Scheme B).
 */

const envAssetsBase = import.meta.env.VITE_ASSETS_BASE_URL;
const envDataBase = import.meta.env.VITE_DATA_BASE_URL;

export const APP_CONFIG = {
  // If not configured, defaults to '.' (local relative assets within current deployment)
  assetsBaseUrl: (envAssetsBase || '.').replace(/\/+$/, ''),
  dataBaseUrl: (envDataBase || envAssetsBase || '.').replace(/\/+$/, ''),
};

/**
 * Resolves a media or static asset path to either a local relative path
 * or an external remote assets repository URL (e.g. GitHub Pages assets repo).
 */
export function resolveAsset(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;

  // Normalize path by removing leading ./ or /
  const cleanPath = path.replace(/^(\.\/|\/)/, '');

  if (APP_CONFIG.assetsBaseUrl === '.' || !APP_CONFIG.assetsBaseUrl) {
    return './' + cleanPath;
  }

  return `${APP_CONFIG.assetsBaseUrl}/${cleanPath}`;
}

/**
 * Resolves JSON data catalog URL.
 */
export function resolveContentUrl(name: string): string {
  const base = APP_CONFIG.dataBaseUrl;
  const cleanName = name.replace(/\.json$/, '');
  if (base === '.' || !base) {
    return `./content/${cleanName}.json?v=perf-v10`;
  }
  return `${base}/content/${cleanName}.json?v=perf-v10`;
}
