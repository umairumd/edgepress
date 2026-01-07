import { Suspense } from "react";
import ContactForm from "./ContactForm";

// Loading skeleton for the form
const ContactFormSkeleton = () => (
    <div className="td-contact-form-skeleton" style={{ opacity: 0.6 }}>
        <div className="row">
            <div className="col-lg-6 mb-25">
                <div style={{ height: 60, background: "#f0f0f0", borderRadius: 8 }} />
            </div>
            <div className="col-lg-6 mb-25">
                <div style={{ height: 60, background: "#f0f0f0", borderRadius: 8 }} />
            </div>
            <div className="col-lg-6 mb-25">
                <div style={{ height: 60, background: "#f0f0f0", borderRadius: 8 }} />
            </div>
            <div className="col-lg-6 mb-25">
                <div style={{ height: 60, background: "#f0f0f0", borderRadius: 8 }} />
            </div>
            <div className="col-lg-12 mb-25">
                <div style={{ height: 120, background: "#f0f0f0", borderRadius: 8 }} />
            </div>
        </div>
    </div>
);

const ContactArea = () => {
    return (
        <div id="contact-form" className="td-contact-main pt-155 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="td-contact-title-wrap mb-30 wow fadeInLeft" data-wow-delay=".5s" data-wow-duration="1s">
                            <h2 className="td-contact-main-title">
                                Reach out for your <span className="td-italic-inquiry">inquiry</span>
                            </h2>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="td-contact-form-box mb-30 wow fadeInRight" data-wow-delay=".5s" data-wow-duration="1s">
                            <Suspense fallback={<ContactFormSkeleton />}>
                                <ContactForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactArea;
