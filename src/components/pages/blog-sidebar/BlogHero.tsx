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

function formatDate(date?: string) {
    if (!date) return "";
    try {
        return new Date(date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return date;
    }
}

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
                <Image
                    className="w-100"
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    priority
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                    unoptimized={process.env.NODE_ENV !== "production" && typeof src === "string" && src.startsWith("http")}
                />
            </div>
        </div>
    )
}

export default BlogHero;

