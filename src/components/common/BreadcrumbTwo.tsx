import type { ReactNode } from "react";

interface DataType {
    sub_title: string;
    title: ReactNode;
    desc: string;
}

const BreadcrumbTwo = ({ sub_title, title, desc }: DataType) => {
    return (
        <div className="td-breadcrumb-area td-breadcrumb-spacing mb-75">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <div className="td-breadcrumb-wrap">
                            <span className="subtitle d-inline-block mb-15">{sub_title}</span>
                            <h2 className="td-section-page-title mb-35">{title}</h2>
                            <p className="text">{desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BreadcrumbTwo;
