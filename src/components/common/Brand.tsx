import Image from "next/image";

const brand_data: string[] = [
    "/assets/img/brand/brand-7/logo-1.png",
    "/assets/img/brand/brand-7/logo-2.png",
    "/assets/img/brand/brand-7/logo-3.png",
    "/assets/img/brand/brand-7/logo-4.png",
    "/assets/img/brand/brand-7/logo-5.png",
    "/assets/img/brand/brand-7/logo-6.png",
    "/assets/img/brand/brand-7/logo-7.png",
    "/assets/img/brand/brand-7/logo-8.png",
];

interface DataType {
    style?: boolean;
}

const Brand = ({ style }: DataType) => {
    const sizeFor = (src: string) => {
        // Match actual asset dimensions to avoid distortion/CLS.
        if (src.endsWith("logo-1.png")) return { w: 83, h: 44 };
        if (src.endsWith("logo-2.png")) return { w: 93, h: 34 };
        if (src.endsWith("logo-3.png")) return { w: 110, h: 22 };
        if (src.endsWith("logo-4.png")) return { w: 128, h: 38 };
        if (src.endsWith("logo-5.png")) return { w: 128, h: 38 };
        if (src.endsWith("logo-6.png")) return { w: 128, h: 30 };
        if (src.endsWith("logo-7.png")) return { w: 128, h: 30 };
        if (src.endsWith("logo-8.png")) return { w: 76, h: 44 };
        return { w: 128, h: 38 };
    };

    return (
        <div className={`td-brands-area ${style ? "pt-160 pb-160" : "pb-115"}`}>
            <div className="container">
                <div className="row gx-0">
                    {brand_data.map((brand, i) => (
                        <div key={i} className="col-lg-3 col-md-4 col-sm-6">
                            <div className="td-brands-7-item text-center">
                                <Image
                                    src={brand}
                                    alt={`Client logo ${i + 1}`}
                                    width={sizeFor(brand).w}
                                    height={sizeFor(brand).h}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Brand;
