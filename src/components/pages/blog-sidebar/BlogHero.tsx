import Image from "next/image";

type Props = {
    title?: string;
    date?: string;
    category?: string;
    author?: string;
    featuredImage?:
        | string
        | {
              url: string;
              alt?: string | null;
              width?: number | null;
              height?: number | null;
          };
};

const BlogHero = ({ featuredImage, title }: Props) => {
    const img =
        typeof featuredImage === "string"
            ? { url: featuredImage }
            : featuredImage;

    const src = img?.url || "/assets/img/blog/sidebar/thumb.jpg";
    const width = img?.width || 1600;
    const height = img?.height || 900;
    const alt = img?.alt || title || "Blog";
    return (
        <div className="td-blog-hero-area">
            <div className="container-fluid p-0">
                <div className="td-blog-hero-media">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        unoptimized={process.env.NODE_ENV !== "production" && typeof src === "string" && src.startsWith("http")}
                    />
                </div>
            </div>
        </div>
    )
}

export default BlogHero;

