import type { Metadata } from "next";
import ContactBreadcrumb from "@/components/pages/contact/ContactBreadcrumb";
import ContactMap from "@/components/pages/contact/ContactMap";
import ContactArea from "@/components/pages/contact/ContactArea";
import ContactBranch from "@/components/pages/contact/ContactBranch";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out to Inoma Digital for expert support in web, SEO, marketing, and growth strategy. Connect with our team to start your digital transformation.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <main>
            <ContactBreadcrumb />
            <ContactMap />
            <ContactArea />
            <ContactBranch />
        </main>
    );
}
