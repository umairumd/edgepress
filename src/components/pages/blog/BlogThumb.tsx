import Image from "next/image";

const BlogThumb = () => {
    return (
        <div className="td-blog-bigthumb-area td-blog-bigthumb-spacing">
            <div className="container container-1530">
                <div className="row">
                    <div className="col-12">
                        <div className="td-rounded-10 overflow-hidden" style={{ maxHeight: "460px" }}>
                            <div style={{ position: "relative", height: "460px", borderRadius: "10px", overflow: "hidden" }}>
                                <Image
                                    src="/assets/img/blog/blog-hero.jpg"
                                    alt="Blogs"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 1530px"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>
                        <div className="text-center mt-35">
                            <h2 className="td-section-page-title mb-0">Blogs</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogThumb;

