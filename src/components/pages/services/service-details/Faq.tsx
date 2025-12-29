"use client";
import { useEffect, useState } from "react";
import faq_data, { FaqItem } from "@/data/FaqData";

interface FaqProps {
    style: boolean;
    /** Which FAQ set to render from `src/data/FaqData.ts` */
    page?: string;
    /** 0-based index of the item opened by default */
    defaultOpenIndex?: number;
}

const Faq = ({ style, page, defaultOpenIndex }: FaqProps) => {

    const [faqData, setFaqData] = useState<FaqItem[]>([]);

    useEffect(() => {
        const pageKey = page ?? "home_2";
        const openIndex = defaultOpenIndex ?? (pageKey === "home_2" ? 1 : 0);

        const filtered = faq_data.filter(item => item.page === pageKey);
        const updatedData = filtered.map((item, index) => ({
            ...item,
            showAnswer: index === openIndex
        }));
        setFaqData(updatedData);
    }, [page, defaultOpenIndex]);

    const toggleAnswer = (faqId: number) => {
        setFaqData((prevFaqData) =>
            prevFaqData.map((faq) => ({
                ...faq,
                showAnswer: faq.id === faqId ? !faq.showAnswer : false
            }))
        );
    };

    return (
        <div className={`${style ? "td-pricing-area td-pricing-main-wrap pb-130" : "td-faq-2-area pt-160"}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="td-faq-2-thumb mb-30 fix td-rounded-10">
                            <img data-speed=".9" className="td-rounded-10" src="/assets/img/faq/faq-2/thumb.jpg" alt="" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="td-faq-4-wrap-right td-faq-2-wrap-right mb-30">
                            <h2 className="td-testimonial-title mb-20 td-text-invert">Frequently asked <span>questions</span></h2>
                            <div className="td-faq-4-accordion wow fadeInRight" data-wow-delay=".5s" data-wow-duration="1s">
                                <div className="accordion" id="accordionExample">
                                    {faqData.map((item) => (
                                        <div key={item.id} className="accordion-items">
                                            <h2 className="accordion-header" onClick={() => toggleAnswer(item.id)}>
                                                <button className={`accordion-buttons ${item.showAnswer ? "" : "collapsed"} `} type="button" style={{ cursor: "pointer" }}>
                                                    {item.title}
                                                    <span className="plus-icon"></span>
                                                </button>
                                            </h2>
                                            <div className={`accordion-collapse collapse ${item.showAnswer ? "show" : ""}`}>
                                                <div className="accordion-body">
                                                    <p>
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Faq;
