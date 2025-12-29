import Link from "next/link";

const Cta = () => {
    return (
        <div className="td-cta-area">
            <div className="container">
                <div className="col-lg-12">
                    <div className="td-cta-wrap p-relative z-index-1 text-center pt-135 pb-135 include-bg" style={{ backgroundImage: `url("/assets/img/cta/cta-bg.jpg")` }}>
                        <img className="td-cta-shape d-none d-xl-block" src="/assets/img/cta/cta.png" alt="" />
                        <h2 className="title p-relative d-inline-block">
                            <img className="td-cta-shape-2 d-none d-md-block" src="/assets/img/cta/cta-2.png" alt="" />
                            <Link href="/contact" className="td-text-invert">
                                HAVE<br />
                                PROJECTS<br />
                                IN MIND?
                            </Link>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cta;
