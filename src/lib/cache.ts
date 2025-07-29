import { CacheItem } from '@/types/book';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function getFromCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    
    const { timestamp, data }: CacheItem<T> = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
}

export function setInCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  const item: CacheItem<T> = { timestamp: Date.now(), data };
  try {
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn("Could not set cache item, clearing old cache.", error);
    sessionStorage.clear();
    try {
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (e2) {
      console.error("Failed to cache even after clearing.", e2);
    }
  }
}

export function clearCache(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.clear();
}

export function removeCacheItem(key: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(key);
}