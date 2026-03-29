import LazyImageClient from "./components/LazyImageClient";
import generateSrcSet from "./utils/generateSrcSet";

const BASE_PATH = "https://images.wainroutes.co.uk/";

type LazyImageProps = {
  name: string;
  className?: string;
  sizes?: string;
  alt?: string;
  maxWidth?: number;
  onClick?: () => void;
};

export default function LazyImage({
  name,
  className,
  sizes = "100vw",
  alt = "",
  maxWidth,
  onClick,
}: LazyImageProps) {
  const [nameMain, nameExt] = name.split(".");
  const path = BASE_PATH + nameMain;
  const extension = nameExt !== undefined ? `.${nameExt}` : ".webp";

  const src = path + "_1024w" + extension;
  const srcSet = generateSrcSet(path + extension, maxWidth);

  return (
    <LazyImageClient
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      blurURL={`url(${path}_32w${extension})`}
      onClick={onClick}
    />
  );
}
