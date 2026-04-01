/* eslint-disable @next/next/no-img-element -- SVGs from /public: next/image breaks many SVGs in prod */
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
} & (
  | { width: number; height: number; fill?: false }
  | { fill: true; width?: never; height?: never }
);

/**
 * Local SVGs from /public often fail with next/image in production (blank/broken).
 * Use a plain img for .svg; next/image for raster formats.
 */
export function AssetImage(props: Props) {
  const { src, alt, className, priority, sizes } = props;

  if (src.endsWith(".svg")) {
    if ("fill" in props && props.fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className ?? ""}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
        />
      );
    }
    const { width, height } = props;
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  if ("fill" in props && props.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  const { width, height } = props;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
