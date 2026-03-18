const CACHE_PREFIX = 'profile_picture_cache:';

interface ProfilePictureCacheRecord {
  dataUrl: string;
  source: string | null;
  updatedAt: number;
}

const normalizeSource = (source?: string | null): string | null => {
  if (!source || typeof source !== 'string') return null;
  const trimmed = source.trim();
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return null;
  }
  return trimmed.split('#')[0].split('?')[0];
};

const getCacheKey = (userId: string) => `${CACHE_PREFIX}${userId}`;

const readCache = (userId: string): ProfilePictureCacheRecord | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(getCacheKey(userId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ProfilePictureCacheRecord;
  } catch {
    localStorage.removeItem(getCacheKey(userId));
    return null;
  }
};

const writeCache = (userId: string, payload: ProfilePictureCacheRecord): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
};

export const getCachedProfilePicture = (userId: string, source?: string | null): string | null => {
  const cache = readCache(userId);
  if (!cache?.dataUrl) return null;

  const normalizedSource = normalizeSource(source);
  if (!normalizedSource || !cache.source) {
    return cache.dataUrl;
  }

  return cache.source === normalizedSource ? cache.dataUrl : null;
};

export const removeCachedProfilePicture = (userId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getCacheKey(userId));
};

export const saveProfilePictureToCache = async (
  userId: string,
  file: File,
  source?: string | null
): Promise<string | null> => {
  const fileToDataUrl = () =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

  try {
    const dataUrl = await fileToDataUrl();
    if (!dataUrl) return null;

    const saved = writeCache(userId, {
      dataUrl,
      source: normalizeSource(source),
      updatedAt: Date.now(),
    });

    return saved ? dataUrl : null;
  } catch {
    return null;
  }
};
