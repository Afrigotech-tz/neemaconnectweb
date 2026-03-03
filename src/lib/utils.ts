import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Base URL for image paths
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://seagreen-mink-431224.hostingersite.com';

/**
 * Converts a relative image path to a full URL for sliders
 * Images are stored in storage/app/public/home_sliders on the backend
 * Should be accessed via /storage/home_sliders/ path
 * 
 * IMPORTANT: Backend already returns full URLs, so we check for that first
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '/placeholder.svg';
  }
  
  // If it's already a full URL (starts with http:// or https://), return as-is
  // Backend returns full URLs like: https://seagreen-mink-431224.hostingersite.com/storage/home_sliders/image.jpg
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove any leading slashes
  let cleanPath = imagePath.replace(/^\/+/, '');
  
  // Remove 'home_sliders/' if it's already in the path (backend might include it)
  if (cleanPath.startsWith('home_sliders/')) {
    cleanPath = cleanPath.replace('home_sliders/', '');
  }
  
  // Prepend API base URL with /storage/home_sliders/ path
  // Backend stores slider images in storage/app/public/home_sliders/
  return `${API_BASE_URL}/storage/home_sliders/${cleanPath}`;
}

/**
 * Converts a relative image path to a full URL for blog posts
 * Images are stored in storage/app/public/blogs on the backend
 * Should be accessed via /storage/blogs/ path
 * 
 * IMPORTANT: Backend already returns full URLs, so we check for that first
 */
export function getBlogImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '/placeholder.svg';
  }
  
  // If it's already a full URL (starts with http:// or https://), return as-is
  // Backend returns full URLs like: https://seagreen-mink-431224.hostingersite.com/storage/blogs/image.jpg
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove any leading slashes
  let cleanPath = imagePath.replace(/^\/+/, '');
  
  // Remove 'blogs/' if it's already in the path (backend might include it)
  if (cleanPath.startsWith('blogs/')) {
    cleanPath = cleanPath.replace('blogs/', '');
  }
  
  // Prepend API base URL with /storage/blogs/ path
  // Backend stores blog images in storage/app/public/blogs/
  return `http://31.170.165.83/storage/blogs/${cleanPath}`;
}
