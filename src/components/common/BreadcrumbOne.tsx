import type { JSX } from "react";

interface DataType {
    sub_title: string;
    title: JSX.Element;
}

const BreadcrumbOne = ({ sub_title, title }: DataType) => {
    return (
        <div className="td-breadcrumb-area td-breadcrumb-spacing mb-75">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <div className="td-breadcrumb-wrap">
                            <span className="subtitle d-inline-block mb-10">{sub_title}</span>
                            <h2 className="td-section-page-title td-section-page-bigtitle mb-35">{title}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BreadcrumbOne;
