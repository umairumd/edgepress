import React from "react";

const founders = [
    {
        thumb: "/assets/img/team/thumb.jpg",
        name: "Umair Umar",
        role: "Co-Founder",
    },
    {
        thumb: "/assets/img/team/thumb-2.jpg",
        name: "Faizan Ahmed",
        role: "Co-Founder",
    },
];

const Founders = () => {
    return (
        <div className="td-about-founders-area pt-100 pb-60">
            <div className="container">
                <div className="row justify-content-center text-center">
                    <div className="col-lg-10">
                        <h3 className="td-section-page-title td-text-invert mb-15">Founders Story</h3>
                        <p className="td-about-body mb-30">
                            Inoma Digital was founded with a simple belief: businesses don’t need more marketing — they need better systems. We built Inoma Digital as a structured, execution-focused agency where strategy, creative, and performance work together under one roof. Today, we support clients globally with a focus on clarity, accountability, and sustainable growth. We don’t chase trends. We build foundations that last.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    {founders.map((item, idx) => (
                        <div key={idx} className="col-lg-4 col-md-5 col-sm-8 mb-30 d-flex justify-content-center">
                            <div className="td-team-4-wrap p-relative td-team-founder">
                                <div className="td-team-4-thumb">
                                    <img className="w-100" src={item.thumb} alt={item.name} />
                                </div>
                                <div className="td-team-4-content text-center static-text">
                                    <span className="td-team-4-subtitle">{item.role}</span>
                                    <h2 className="td-team-4-title td-team-founder-name">{item.name}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Founders;

