import Link from "next/link";
import pricing_data from "@/data/PricingData";

const PricingArea = () => {
    return (
        <div className="td-pricing-area td-pricing-main-wrap pb-130">
            <div className="container">
                <div className="row">
                    {pricing_data.map((item) => (
                        <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".4s" data-wow-duration="1s">
                            <div className="td-pricing-6-wrap mb-30">
                                <div className="td-pricing-6-top">
                                    <span className="package mb-35 d-inline-block">{item.title}</span>
                                    <p className="para mb-55">{item.desc}</p>
                                    <h6 className="price mb-15">{item.price}</h6>
                                    {item.priceNote && <div className="td-pricing-note mb-25">{item.priceNote}</div>}
                                    <Link className={`price-btn ${item.active ? item.active : ""}`} href="/contact">Get Started</Link>
                                </div>
                                <div className="td-pricing-6-list">
                                    <ul>
                                        {item.list.map((list, i) => (
                                            <li key={i}>{list}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="td-pricing-microline text-center mt-20">
                            <p className="mb-0">
                                Packages are outcome-based.<br />
                                Focus can be adjusted without breaking the system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingArea;
