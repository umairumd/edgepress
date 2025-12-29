"use client";
import { useMemo, useState } from "react";
import faq_data, { FaqItem } from "@/data/FaqData";

const FaqArea = () => {

    const faqData = useMemo(() => {
        return faq_data.filter((item) => item.page === "inner_faq");
    }, []);

    const [openId, setOpenId] = useState<number | null>(() => {
        return faqData[0]?.id ?? null;
    });

    const toggleAnswer = (faqId: number) => {
        setOpenId((prev) => (prev === faqId ? null : faqId));
    };

    return (
        <div className="td-faq-2-area pb-130">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="td-faq-2-thumb td-faq-main-thumb mt-40 mr-110 mb-30">
                            <img className="td-rounded-10" src="/assets/img/faq/main/thumb.jpg" alt="" />
                            <div className="td-faq-main-form pt-50">
                                <form onClick={(e) => e.preventDefault()} className="p-relative">
                                    <input className="inputs" type="text" placeholder="Search product" />
                                    <button className="td-faq-main-btn" type="submit">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.8889 15.2222C5.96154 15.2222 2.7778 12.0385 2.7778 8.1111C2.7778 4.18375 5.96154 1 9.8889 1C13.8163 1 17 4.18375 17 8.1111C17 12.0385 13.8163 15.2222 9.8889 15.2222Z" stroke="#1C1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M1.00053 17.0001L4.86719 13.1334" stroke="#1C1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="td-faq-4-wrap-right td-faq-2-wrap-right td-faq-main-wrap-right mb-30">
                            <div className="td-faq-4-accordion">
                                <div className="accordion" id="accordionExample">
                                    {faqData.map((item) => (
                                        <div key={item.id} className="accordion-items">
                                            <h2 className="accordion-header" onClick={() => toggleAnswer(item.id)}>
                                                <button className={`accordion-buttons ${item.id === openId ? "" : "collapsed"} `} type="button" style={{ cursor: "pointer" }}>
                                                    {item.title}
                                                    <span className="plus-icon"></span>
                                                </button>
                                            </h2>
                                            <div className={`accordion-collapse collapse ${item.id === openId ? "show" : ""}`}>
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

export default FaqArea;
