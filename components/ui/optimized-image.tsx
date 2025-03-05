"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
  lowQualitySrc?: string;
  isPriority?: boolean;
}

/**
 * OptimizedImage component that handles responsive images with proper loading strategies
 * - Supports WebP and AVIF formats automatically
 * - Handles image loading states
 * - Provides fallback for image errors
 * - Optimizes for Core Web Vitals
 */
export function OptimizedImage({
  src,
  fallbackSrc = "/placeholder.svg",
  lowQualitySrc,
  isPriority = false,
  alt,
  width,
  height,
  className,
  style,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(lowQualitySrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Use the high-quality image once the component mounts
  useEffect(() => {
    if (lowQualitySrc && !error) {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setError(true);
        setImgSrc(fallbackSrc);
      };
    }
  }, [src, lowQualitySrc, fallbackSrc, error]);

  return (
    <div className={`relative ${className || ""}`} style={style}>
      <Image
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setImgSrc(fallbackSrc);
        }}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className || ""}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={85}
        {...props}
      />
      
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-md"
          aria-hidden="true"
        />
      )}
    </div>
  );
} 