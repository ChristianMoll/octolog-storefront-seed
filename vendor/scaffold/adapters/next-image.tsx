import React from "react";

export interface ImageProps extends Record<string, unknown> {
  src: string | { src: string; height: number; width: number };
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
  className?: string;
}

const NextImage = (props: Record<string, unknown>) => {
  const { src, alt, fill, priority, loader, ...rest } = props;
  const imgSrc = typeof src === "object" && src !== null ? (src as { src: string }).src : (src as string);
  return React.createElement("img", { src: imgSrc, alt: alt as string, ...rest });
};

export default NextImage;
