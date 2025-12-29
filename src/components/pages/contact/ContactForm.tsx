"use client";

import { FormEvent, useState } from "react";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="names">Name</label>
                        <input className="inputs" id="names" name="name" type="text" placeholder="Rober Crues" value={formData.name} onChange={handleChange} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="email">Email</label>
                        <input className="inputs" id="email" name="email" type="email" placeholder="don@gmail.com" value={formData.email} onChange={handleChange} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="subject">Subject</label>
                        <input className="inputs" id="subject" name="subject" type="text" placeholder="Your subject" value={formData.subject} onChange={handleChange} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="phone">Phone</label>
                        <input className="inputs" id="phone" name="phone" type="text" placeholder="+999" value={formData.phone} onChange={handleChange} />
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="textareas">Message</label>
                        <textarea className="inputs textareas" id="textareas" name="message" placeholder="Write your message" value={formData.message} onChange={handleChange}></textarea>
                    </div>
                    <button className="td-contact-7-btn" type="submit">Let’s Talk</button>
                </div>
            </div>
        </form>
    )
}

export default ContactForm;

