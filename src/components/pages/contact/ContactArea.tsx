import ContactForm from "./ContactForm";

const ContactArea = () => {
    return (
        <div className="td-contact-main pt-155 pb-120">
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
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactArea;

