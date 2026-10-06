/**
 * Modern 2026 Image Optimization Engine for WebBuilder
 * Converts standard web images (PNG, JPEG, BMP, etc.) into ultra-lightweight WebP
 * with near-lossless visual quality (88-90%), preserving transparency and high-DPI clarity.
 */

export type OptimizationProgressCallback = (
  progress: number,
  statusText: string,
) => void;

export type OptimizeImageOptions = {
  /** Target quality between 0.1 and 1.0 (default: 0.88 for near-lossless clarity) */
  quality?: number;
  /** Maximum width constraint (default: 2560px for high-DPI displays) */
  maxWidth?: number;
  /** Maximum height constraint (default: 2560px) */
  maxHeight?: number;
  /** Progress notification callback */
  onProgress?: OptimizationProgressCallback;
};

export type OptimizedImageResult = {
  file: File;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
  width: number;
  height: number;
  mimeType: string;
};

export async function optimizeImageToWebP(
  file: File,
  options: OptimizeImageOptions = {},
): Promise<OptimizedImageResult> {
  const {
    quality = 0.88,
    maxWidth = 2560,
    maxHeight = 2560,
    onProgress,
  } = options;

  const originalSize = file.size;

  // If file is SVG, animated GIF, or not a static image, return as-is
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif" ||
    !file.type.startsWith("image/")
  ) {
    onProgress?.(100, "Ready");
    return {
      file,
      originalSize,
      optimizedSize: originalSize,
      savedPercent: 0,
      width: 0,
      height: 0,
      mimeType: file.type,
    };
  }

  onProgress?.(15, "Reading image data…");

  // Load image safely
  const img = await loadImageFromFile(file);

  onProgress?.(45, "Optimizing to WebP…");

  let { width, height } = img;

  // Calculate scaled dimensions while preserving aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Draw to high-precision Canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });

  if (!ctx) {
    throw new Error("Unable to create 2D canvas context for image optimization.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  onProgress?.(75, "Compressing WebP…");

  // Convert canvas to WebP Blob
  const webpBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/webp", quality);
  });

  if (!webpBlob) {
    throw new Error("Failed to convert image to WebP format.");
  }

  // If converted WebP is somehow larger than original (rare for small icons), keep original
  if (webpBlob.size >= originalSize && file.type === "image/webp") {
    onProgress?.(100, "Optimization complete");
    return {
      file,
      originalSize,
      optimizedSize: originalSize,
      savedPercent: 0,
      width,
      height,
      mimeType: file.type,
    };
  }

  // Generate clean .webp filename
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const newFileName = `${baseName}.webp`;

  const optimizedFile = new File([webpBlob], newFileName, {
    type: "image/webp",
    lastModified: Date.now(),
  });

  const optimizedSize = optimizedFile.size;
  const savedPercent = Math.max(
    0,
    Math.round(((originalSize - optimizedSize) / originalSize) * 100),
  );

  onProgress?.(100, `Optimized: ${savedPercent}% smaller`);

  return {
    file: optimizedFile,
    originalSize,
    optimizedSize,
    savedPercent,
    width,
    height,
    mimeType: "image/webp",
  };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode image: ${file.name}`));
    };

    img.src = url;
  });
}
