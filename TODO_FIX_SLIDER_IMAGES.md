# Fix Slider Images from Backend

## Task
Fix the issue where slider images from the backend are not visible because they're returned as relative paths without the full URL.

## Plan
1. Add utility function in lib/utils.ts to prepend API base URL to relative image paths
2. Update SliderContext to transform image URLs when fetching sliders
3. Update HeroSlider.tsx to use the utility function for displaying images
4. Update SlidersList.tsx (admin panel) to use the utility function
5. Apply same fix to Blog component (BlogManagement.tsx and related)

## Status
- [x] Add getImageUrl utility function in lib/utils.ts
- [x] Update HeroSlider.tsx to use utility function
- [x] Update SlidersList.tsx to use utility function
- [x] Update BlogsList.tsx (admin panel) to use utility function
- [x] Update Blog.tsx (public page) to use utility function

