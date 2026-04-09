import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { buildStorageAssetUrl } from "@/lib/apiUrl"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a relative image path to a full URL for sliders
 * Images are stored in storage/app/public/home_sliders on the backend
 * Should be accessed via /storage/home_sliders/ path
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  return buildStorageAssetUrl('home_sliders', imagePath) || '/placeholder.svg';
}

/**
 * Converts a relative image path to a full URL for blog posts
 * Images are stored in storage/app/public/blogs on the backend
 * Should be accessed via /storage/blogs/ path
 */
export function getBlogImageUrl(imagePath: string | null | undefined): string {
  return buildStorageAssetUrl('blogs', imagePath) || '/placeholder.svg';
}
