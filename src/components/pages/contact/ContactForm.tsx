"use client";

import { FormEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type FormStatus = "idle" | "loading" | "success" | "error";

const ContactForm = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
        website: "",
    });

    // Pre-fill email from URL parameter (from footer form redirect)
    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setFormData((prev) => ({ ...prev, email: emailParam }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus("error");
            setErrorMessage("Please fill in Name, Email, and Message fields.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            // Reset form on success
            setFormData({ name: "", email: "", subject: "", phone: "", message: "", website: "" });
        } catch {
            setStatus("error");
            setErrorMessage("Unable to send your message. Please try again later or contact us directly.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden"
            }} aria-hidden="true">
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="names">Name *</label>
                        <input 
                            className="inputs" 
                            id="names" 
                            name="name" 
                            type="text" 
                            placeholder="Your name" 
                            value={formData.name} 
                            onChange={handleChange}
                            disabled={status === "loading"}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="email">Email *</label>
                        <input 
                            className="inputs" 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="your@email.com" 
                            value={formData.email} 
                            onChange={handleChange}
                            disabled={status === "loading"}
                            required
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="subject">Subject</label>
                        <input 
                            className="inputs" 
                            id="subject" 
                            name="subject" 
                            type="text" 
                            placeholder="Your subject" 
                            value={formData.subject} 
                            onChange={handleChange}
                            disabled={status === "loading"}
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="phone">Phone</label>
                        <input 
                            className="inputs" 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            placeholder="+1 (555) 123-4567" 
                            value={formData.phone} 
                            onChange={handleChange}
                            disabled={status === "loading"}
                        />
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="td-contact-7-input-item mb-25">
                        <label className="labels" htmlFor="textareas">Message *</label>
                        <textarea 
                            className="inputs textareas" 
                            id="textareas" 
                            name="message" 
                            placeholder="Tell us about your project..." 
                            value={formData.message} 
                            onChange={handleChange}
                            disabled={status === "loading"}
                            required
                        ></textarea>
                    </div>
                    
                    {/* Success Message */}
                    {status === "success" && (
                        <div className="td-contact-success mb-20" style={{ 
                            padding: "15px 20px", 
                            background: "rgba(16, 185, 129, 0.1)", 
                            border: "1px solid #10b981",
                            borderRadius: "8px",
                            color: "#059669"
                        }}>
                            <strong>Thank you!</strong> Your message has been sent successfully. We&apos;ll get back to you soon.
                        </div>
                    )}
                    
                    {/* Error Message */}
                    {status === "error" && errorMessage && (
                        <div className="td-contact-error mb-20" style={{ 
                            padding: "15px 20px", 
                            background: "rgba(239, 68, 68, 0.1)", 
                            border: "1px solid #ef4444",
                            borderRadius: "8px",
                            color: "#dc2626"
                        }}>
                            {errorMessage}
                        </div>
                    )}
                    
                    <button 
                        className="td-contact-7-btn" 
                        type="submit"
                        disabled={status === "loading"}
                        style={{ opacity: status === "loading" ? 0.7 : 1 }}
                    >
                        {status === "loading" ? "Sending..." : "Let's Talk"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContactForm;
