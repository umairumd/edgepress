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
    const sizeFor = (index: number) => {
        // Bottom row (5, 6, 7, 8) ~15% larger than top row
        if (index >= 4) return { w: 207, h: 207 }; // 180 * 1.15
        return { w: 140, h: 140 };
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
                                    width={sizeFor(i).w}
                                    height={sizeFor(i).h}
                                    className={`td-brand-logo ${i >= 4 && i <= 6 ? "td-brand-logo--bottom-row" : ""} ${i === 7 ? "td-brand-logo--bottom-row-last" : ""}`}
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
