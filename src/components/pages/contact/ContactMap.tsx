import Link from "next/link";

const ContactMap = () => {
    return (
        <div className="td-contact-map-area">
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-12">
                        <div className="td-contact-map p-relative">
                            <div className="td-contact-map-wrap">
                                <img className="mb-60" src="/assets/img/logo/inoma-logo-for-dark.png" alt="Inoma Digital" />
                                <h6 className="mb-25">Contact Info</h6>
                                <div className="td-contact-info-item d-flex align-items-center mb-10">
                                    <i className="fa-solid fa-phone mr-10" aria-hidden="true"></i>
                                    <Link href="tel:+923142551400">+92-314-2551400</Link>
                                </div>
                                <div className="td-contact-info-item d-flex align-items-center mb-10">
                                    <i className="fa-solid fa-envelope mr-10" aria-hidden="true"></i>
                                    <Link href="mailto:info@inomadigital.com">info@inomadigital.com</Link>
                                </div>
                                <div className="td-contact-info-item d-flex align-items-start">
                                    <i className="fa-solid fa-location-dot mr-10" aria-hidden="true"></i>
                                    <p className="mb-0">M.A Jinnah Road, Okara</p>
                                </div>
                            </div>
                            <div className="td-contact-map-inner">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3426.921637343648!2d73.43281717625457!3d30.804831782143342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922a76448baad03%3A0xa3d289e5fa228a2!2sInoma%20Digital!5e0!3m2!1sen!2s!4v1766956899442!5m2!1sen!2s"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactMap;

