import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to modify YouTube URL to enable embedding
export const getEmbedUrl = (url: string) => {
  // Check if it's a YouTube URL
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    // Extract video ID
    let videoId = "";

    if (url.includes("youtube.com/watch")) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
    }

    if (videoId) {
      // Create proper embed URL with necessary parameters
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${encodeURIComponent(
        window.location.origin
      )}`;
    }
  }

  // Return original URL if not YouTube or couldn't parse
  return url;
};
