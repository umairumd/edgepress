import Link from "next/link";
import pricing_data from "@/data/PricingData";

const Pricing = () => {
    return (
        <div className="td-pricing-area td-pricing-main-wrap pt-155 pb-130">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-8 col-xl-9 col-lg-10">
                        <div className="td-pricing-6-title-wrap text-center mb-65">
                            <span className="td-section-6-subtitle d-inline-block mb-15">OUR SUITABLE PRICING PLANS</span>
                            <h2 className="td-section-6-bigtitle td-text-opacity">SCALE WITH CONFIDENCE</h2>
                        </div>
                    </div>
                </div>
                <div className="row pricing-row">
                    {pricing_data.map((item) => (
                        <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".4s" data-wow-duration="1s">
                            <div className={`td-pricing-6-wrap mb-30 pricing-card ${item.active ? "pricing-card--featured" : ""}`}>
                                <div className="td-pricing-6-top">
                                    {item.active ? <div className="pricing-badge">Most Popular</div> : null}
                                    <span className="package mb-35 d-inline-block">{item.title}</span>
                                    <p className="para mb-35">{item.desc}</p>
                                    {/* Homepage: do not show prices */}
                                    <Link className={`price-btn ${item.active || ''}`} href="/contact">Get Started</Link>
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

export default Pricing;
