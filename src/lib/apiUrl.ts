const DEFAULT_API_BASE_URL = '/api/';
const DEFAULT_PRODUCTION_API_BASE_URL = 'https://seagreen-mink-431224.hostingersite.com/api/';
const LEGACY_BACKEND_HOSTS = new Set(['31.170.165.83']);

const getRuntimeOrigin = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.origin;
};

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    const runtimeOrigin = getRuntimeOrigin();
    if (!runtimeOrigin) {
      return null;
    }

    try {
      return new URL(value, runtimeOrigin);
    } catch {
      return null;
    }
  }
};

const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, '');

const shouldUseVerifiedProductionApi = (parsedUrl: URL): boolean => {
  const runtimeOrigin = getRuntimeOrigin();

  if (LEGACY_BACKEND_HOSTS.has(parsedUrl.hostname)) {
    return true;
  }

  if (!runtimeOrigin) {
    return false;
  }

  return parsedUrl.port === '8000' && parsedUrl.origin !== runtimeOrigin;
};

export const API_BASE_URL = (() => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (import.meta.env.DEV) {
    return DEFAULT_API_BASE_URL;
  }

  if (!configuredBaseUrl) {
    return DEFAULT_PRODUCTION_API_BASE_URL;
  }

  const parsedUrl = parseUrl(configuredBaseUrl);
  if (parsedUrl && shouldUseVerifiedProductionApi(parsedUrl)) {
    return DEFAULT_PRODUCTION_API_BASE_URL;
  }

  return trimTrailingSlashes(configuredBaseUrl);
})();

export const API_ORIGIN = (() => {
  const parsedUrl = parseUrl(API_BASE_URL);

  if (parsedUrl?.origin && parsedUrl.origin !== 'null') {
    return parsedUrl.origin;
  }

  return getRuntimeOrigin();
})();

const joinWithOrigin = (path: string): string => {
  if (!API_ORIGIN) {
    return path;
  }

  return `${API_ORIGIN}${path}`;
};

const shouldRewriteAbsoluteUrl = (parsedUrl: URL): boolean => {
  if (LEGACY_BACKEND_HOSTS.has(parsedUrl.hostname)) {
    return true;
  }

  const runtimeOrigin = getRuntimeOrigin();
  if (!runtimeOrigin) {
    return false;
  }

  return parsedUrl.port === '8000' && parsedUrl.origin !== runtimeOrigin;
};

const normalizePathSeparators = (value: string): string => value.replace(/\\/g, '/');

const stripStorageDirectoryPrefix = (directory: string, value: string): string => {
  let normalizedValue = normalizePathSeparators(value).replace(/^\/+/, '');
  const candidatePrefixes = [
    `storage/app/public/${directory}/`,
    `public/storage/${directory}/`,
    `app/public/${directory}/`,
    `storage/${directory}/`,
    `${directory}/`,
  ];

  for (const prefix of candidatePrefixes) {
    if (normalizedValue.startsWith(prefix)) {
      return normalizedValue.slice(prefix.length);
    }
  }

  return normalizedValue;
};

export const normalizeBackendAssetUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const rawValue = value.trim();
  if (!rawValue) {
    return null;
  }

  if (/^(data:|blob:)/i.test(rawValue)) {
    return rawValue;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    const parsedUrl = parseUrl(rawValue);

    if (!parsedUrl) {
      return rawValue;
    }

    if (shouldRewriteAbsoluteUrl(parsedUrl)) {
      return joinWithOrigin(`${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`);
    }

    return rawValue;
  }

  if (!rawValue.includes('/')) {
    return null;
  }

  if (rawValue.startsWith('/')) {
    return joinWithOrigin(rawValue);
  }

  return joinWithOrigin(`/${rawValue.replace(/^\/+/, '')}`);
};

export const buildStorageAssetUrl = (directory: string, value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const rawValue = value.trim();
  if (!rawValue) {
    return null;
  }

  if (/^(data:|blob:)/i.test(rawValue)) {
    return rawValue;
  }

  if (rawValue.startsWith('/lovable-uploads/')) {
    return joinWithOrigin(rawValue);
  }

  if (/^https?:\/\//i.test(rawValue)) {
    const parsedUrl = parseUrl(rawValue);

    if (!parsedUrl) {
      return rawValue;
    }

    const cleanPath = stripStorageDirectoryPrefix(directory, parsedUrl.pathname);
    if (cleanPath !== parsedUrl.pathname.replace(/^\/+/, '')) {
      return joinWithOrigin(`/storage/${directory}/${cleanPath}${parsedUrl.search}${parsedUrl.hash}`);
    }

    if (shouldRewriteAbsoluteUrl(parsedUrl)) {
      return joinWithOrigin(`${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`);
    }

    return rawValue;
  }

  const normalizedValue = normalizePathSeparators(rawValue).replace(/^\/+/, '');
  if (normalizedValue.startsWith(`storage/${directory}/`)) {
    return joinWithOrigin(`/${normalizedValue}`);
  }

  const cleanPath = stripStorageDirectoryPrefix(directory, normalizedValue);
  return joinWithOrigin(`/storage/${directory}/${cleanPath}`);
};
