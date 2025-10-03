import React, { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  fallback?: string;
  webpSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  decoding = "async",
  fallback,
  webpSrc,
}) => {
  const [imageError, setImageError] = useState(false);
  const [webpSupported, setWebpSupported] = useState(true);

  // Check if WebP is supported
  React.useEffect(() => {
    // Skip WebP detection in test environment
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
      setWebpSupported(false);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const dataURL = canvas.toDataURL("image/webp");
        setWebpSupported(dataURL.indexOf("data:image/webp") === 0);
      }
    } catch {
      // Fallback for environments that don't support canvas
      setWebpSupported(false);
    }
  }, []);

  const handleError = () => {
    setImageError(true);
  };

  // If there's an error and we have a fallback, use it
  if (imageError && fallback) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
      />
    );
  }

  // If WebP is supported and we have a WebP version, use it
  if (webpSupported && webpSrc && !imageError) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          className={className}
          loading={loading}
          decoding={decoding}
          onError={handleError}
        />
      </picture>
    );
  }

  // Fallback to original image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={handleError}
    />
  );
};

export default OptimizedImage;
