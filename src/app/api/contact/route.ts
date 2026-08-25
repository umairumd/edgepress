import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT_EMAIL = (process.env.CONTACT_TO_EMAIL || "").trim();
const FROM_EMAIL = (process.env.CONTACT_FROM_EMAIL || "").trim();

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;
function getResend(): Resend {
    if (!resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY environment variable is not set");
        }
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

interface ContactFormData {
    name: string;
    email: string;
    subject?: string;
    phone?: string;
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();

        if (!RECIPIENT_EMAIL || !FROM_EMAIL) {
            return NextResponse.json(
                { error: "Contact email is not configured. Set CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL." },
                { status: 500 }
            );
        }

        // Validate required fields
        if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Build email content
        const subject = body.subject?.trim() 
            ? `[Website Inquiry] ${body.subject}` 
            : `[Website Inquiry] New message from ${body.name}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0277b5; border-bottom: 2px solid #0277b5; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(body.name)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a>
                        </td>
                    </tr>
                    ${body.phone ? `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            <a href="tel:${escapeHtml(body.phone)}">${escapeHtml(body.phone)}</a>
                        </td>
                    </tr>
                    ` : ''}
                    ${body.subject ? `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(body.subject)}</td>
                    </tr>
                    ` : ''}
                </table>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
${escapeHtml(body.message)}
                    </div>
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                    This message was sent from the contact form at inomadigital.com
                </p>
            </div>
        `;

        // Send email via Resend
        const { error } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: [RECIPIENT_EMAIL],
            replyTo: body.email,
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            console.error("Resend error:", JSON.stringify(error, null, 2));
            // User-friendly message - don't expose technical details
            return NextResponse.json(
                { error: "Unable to send your message at this time. Please try again later or contact us directly." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Contact form error:", err);
        // User-friendly message - don't expose technical details
        return NextResponse.json(
            { error: "Unable to send your message at this time. Please try again later or contact us directly." },
            { status: 500 }
        );
    }
}

// Helper to escape HTML and prevent XSS
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
