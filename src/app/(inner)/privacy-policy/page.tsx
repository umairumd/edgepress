import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import WpContent from "@/components/common/WpContent";
import { getPrivacyPolicy } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

export const revalidate = 300;

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPolicy();

  return (
    <main>
      <BreadcrumbTwo
        sub_title="LEGAL"
        title="Privacy Policy"
        desc="How Inoma Digital collects, uses, and protects your information."
      />
      <section className="mb-60 pt-0" style={{ marginTop: "-40px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
              {page?.content ? (
                <WpContent html={page.content} className="td-wp-content" />
              ) : (
                <p>Privacy Policy content is currently unavailable.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
