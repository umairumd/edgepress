import Link from "next/link"

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
    return (
        <div className={`td-brands-area ${style ? "pt-160 pb-160" : "pb-115"}`}>
            <div className="container">
                <div className="row gx-0">
                    {brand_data.map((brand, i) => (
                        <div key={i} className="col-lg-3 col-md-4 col-sm-6">
                            <div className="td-brands-7-item text-center">
                                <Link href="#"><img src={brand} alt="" /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Brand;
