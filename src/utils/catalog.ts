import type { Pattern, Product, SiteInfo } from '../types';
import { resolveContentUrl } from './config';

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

export async function loadCatalog<T>(name: string): Promise<T> {
  if (cache.has(name)) {
    return cache.get(name) as T;
  }
  let pending = inflight.get(name);
  if (!pending) {
    const url = resolveContentUrl(name);
    pending = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('目录加载失败，请刷新重试');
        return r.json();
      })
      .then((data) => {
        cache.set(name, data);
        return data;
      })
      .catch((err) => {
        inflight.delete(name);
        throw err;
      });
    inflight.set(name, pending);
  }
  return pending as Promise<T>;
}

export function loadSiteInfo() {
  return loadCatalog<SiteInfo>('site');
}

export async function loadPatterns(): Promise<Pattern[]> {
  try {
    return await loadCatalog<Pattern[]>('patterns.normalized');
  } catch {
    return await loadCatalog<Pattern[]>('patterns');
  }
}

export function loadProducts() {
  return loadCatalog<Product[]>('products');
}
