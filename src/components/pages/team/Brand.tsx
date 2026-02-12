import Image from "next/image";

// Same 8 logos as Service page Brand section (brand-7)
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

// Service page proportions: top row 120px, logos 5-7: 200px, logo 8: 155px
const logoHeightFor = (index: number) => {
    if (index >= 4 && index <= 6) return 200;
    if (index === 7) return 155;
    return 120;
};

const Brand = () => {
    const items = [...brand_data, ...brand_data];
    return (
        <div className="td-brand-area td-brand-marquee-area pt-90 pb-150">
            <div className="container-fluid px-0">
                <div className="td-brand-marquee">
                    <div className="td-brand-marquee-track" aria-hidden="true">
                        {items.map((brand, i) => {
                            const origIdx = i % 8;
                            const h = logoHeightFor(origIdx);
                            return (
                                <div key={i} className="td-brand-marquee-item" data-h={h}>
                                    <Image
                                        src={brand}
                                        alt=""
                                        width={Math.max(h, 200)}
                                        height={h}
                                        sizes="200px"
                                        style={{ width: "auto", height: h }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Brand;
