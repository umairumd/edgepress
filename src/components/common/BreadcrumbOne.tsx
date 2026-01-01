import type { JSX } from "react";

interface DataType {
    sub_title?: string;
    title: JSX.Element;
    className?: string;
    description?: string;
    variant?: "default" | "about";
}

const BreadcrumbOne = ({ sub_title, title, className, description, variant = "default" }: DataType) => {
    if (variant === "about") {
        return (
            <div className={`td-breadcrumb-area td-breadcrumb-spacing mb-75 ${className || ""}`.trim()}>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-10">
                            <div className="td-about-main-wrapper pb-40">
                                {sub_title ? <span className="subtitle d-inline-block mb-10">{sub_title}</span> : null}
                                <h2 className="td-section-page-title td-title-anim mb-20">{title}</h2>
                                {description ? <p className="td-about-body mb-0">{description}</p> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`td-breadcrumb-area td-breadcrumb-spacing mb-75 ${className || ""}`.trim()}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <div className="td-breadcrumb-wrap">
                            {sub_title ? <span className="subtitle d-inline-block mb-10">{sub_title}</span> : null}
                            <h2 className="td-section-page-title td-section-page-bigtitle mb-35">{title}</h2>
                            {description ? <p className="mb-0">{description}</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BreadcrumbOne;
