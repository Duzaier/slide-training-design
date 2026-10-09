import { presentationSlides } from '../data/presentationData';
import { getAssetUrl } from './assetHelper';

// Global cache to keep references in memory and prevent garbage collection
const decodedImageCache = new Map<string, HTMLImageElement>();

const DECOR_ASSET_PATHS = [
  '/assets/decor_chatgpt_3d.png',
  '/assets/decor_photoshop_3d.png',
  '/assets/decor_moon_planet.png',
  '/assets/decor_nebula_planet.png',
  '/assets/speaker_portrait.png',
  '/assets/slide2_poster_1.png',
  '/assets/slide2_poster_2.png',
  '/assets/bt 1.png',
  '/assets/slide4_real_model.png',
  '/assets/slide4_pose_ref.png',
  '/assets/slide4_ai_model.png',
  '/assets/310b3c93b56be36f537471a68bb84fe4.jpg',
  '/assets/700ef2bb7f79b95bcd3a084cb2095559.jpg',
  '/assets/b2febc677701abb5f05e69a56974f5ab.jpg'
];

/**
 * Preloads and fully decodes a single image into memory.
 */
export const preloadImage = async (url: string): Promise<HTMLImageElement | null> => {
  if (!url) return null;
  const resolvedUrl = getAssetUrl(url);

  if (decodedImageCache.has(resolvedUrl)) {
    return decodedImageCache.get(resolvedUrl)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';

    const handleSuccess = () => {
      decodedImageCache.set(resolvedUrl, img);
      resolve(img);
    };

    const handleError = () => {
      resolve(null);
    };

    img.onload = handleSuccess;
    img.onerror = handleError;
    img.src = resolvedUrl;

    if (typeof img.decode === 'function') {
      img.decode()
        .then(handleSuccess)
        .catch(() => {
          // If decode fails, img.onload will handle or resolve
        });
    }
  });
};

/**
 * Preloads all slide images and decor assets across the entire presentation.
 * Runs in the background on startup so slide transitions render instantly.
 */
export const preloadAllPresentationAssets = (): void => {
  const allUrls = new Set<string>();

  // 1. Decor & common key visuals
  DECOR_ASSET_PATHS.forEach((path) => allUrls.add(path));

  // 2. All slide images from data
  presentationSlides.forEach((slide) => {
    if (slide.images && Array.isArray(slide.images)) {
      slide.images.forEach((img) => {
        if (img?.url) allUrls.add(img.url);
      });
    }
  });

  // 3. High-priority batch preload
  const urlList = Array.from(allUrls);
  
  // Preload immediate first 5 slides in parallel first
  const priorityCount = 8;
  const immediateUrls = urlList.slice(0, priorityCount);
  const secondaryUrls = urlList.slice(priorityCount);

  immediateUrls.forEach((url) => {
    preloadImage(url);
  });

  // Preload remaining assets with requestIdleCallback or setTimeout
  const preloadRemaining = () => {
    secondaryUrls.forEach((url) => {
      preloadImage(url);
    });
  };

  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadRemaining, { timeout: 1500 });
    } else {
      setTimeout(preloadRemaining, 100);
    }
  }
};
