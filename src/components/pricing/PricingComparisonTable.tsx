import Link from "next/link";
import pricing_data from "@/data/PricingData";

type ComparisonRow = {
  deliverable: string;
  brandFoundation: string;
  growthPackage: string;
  agencyPartner: string;
};

type ComparisonGroup = {
  serviceArea: string;
  serviceAreaSubtitle?: string;
  rows: ComparisonRow[];
};

const deliverableTooltips: Record<string, string> = {
  "Platforms Managed":
    "We create and manage content across the agreed number of social media platforms (e.g., Instagram, Facebook, LinkedIn), ensuring consistent brand presence.",
  "Posts / Month":
    "Strategic content pieces published monthly to maintain visibility, engagement, and audience growth.",
  "Short-Form Videos":
    "Reels or short vertical videos designed to increase reach, improve engagement, and stay aligned with platform algorithms.",
  "Community Management":
    "Responding to comments and messages, maintaining brand tone, and improving audience interaction.",
  "Content Writing":
    "Caption writing, messaging structure, and copy aligned with your brand voice and business goals.",
  "Posting/Scheduling":
    "Content is uploaded, scheduled, and optimized at the right times for maximum visibility.",
  "Ad Platforms":
    "The number of advertising platforms (Meta, Google, etc.) we actively manage for your business.",
  "Active Campaigns":
    "Live ad campaigns structured around specific objectives (leads, traffic, conversions).",
  "Ad Variations / Month":
    "Multiple versions of creatives and copy tested to improve performance and reduce ad fatigue.",
  "Optimization Frequency":
    "How often campaigns are analyzed and adjusted to improve results and reduce wasted spend.",
  "Conversion Tracking":
    "Setup of tracking systems (Pixel, GA4, conversion events) to measure real results, not just clicks.",
  "Campaigns / Month":
    "Strategic email campaigns sent to your audience for promotions, nurturing, and retention.",
  "Automation Flows":
    "Pre-built email sequences (e.g., welcome, abandoned cart, follow-ups) that run automatically.",
  "Audience Segmentation":
    "Organizing subscribers into targeted groups for personalized communication and better conversion rates.",
  "Keyword Research":
    "Identifying high-impact search terms your target customers are actively searching for.",
  "On-Page Optimization":
    "Improving page titles, content structure, internal links, and technical elements for better rankings.",
  "Blog Content":
    "SEO-focused blog articles designed to attract organic traffic and establish authority.",
  "Technical SEO":
    "Backend optimizations that improve website speed, indexing, crawlability, and overall performance.",
  "SEO Monitoring":
    "Tracking keyword performance and search visibility using tools like Google Search Console.",
  "Landing Pages":
    "Dedicated pages designed to convert traffic into leads or sales.",
  "Conversion Optimization (CRO)":
    "Improving layout, messaging, and structure to increase the percentage of visitors who take action.",
  "Website Support":
    "Ongoing technical fixes, content updates, and minor improvements to keep your site running smoothly.",
  "Performance Reports":
    "Monthly reports showing growth metrics, traffic, ad performance, and key insights.",
  "Strategy Calls":
    "Dedicated calls to review performance, refine direction, and plan next steps.",
  "Recommended Commitment":
    "A minimum duration required to properly implement and measure growth strategies.",
};

const comparisonGroups: ComparisonGroup[] = [
  {
    serviceArea: "Social Media",
    rows: [
      { deliverable: "Platforms Managed", brandFoundation: "2", growthPackage: "3", agencyPartner: "4" },
      { deliverable: "Posts / Month", brandFoundation: "8", growthPackage: "12", agencyPartner: "16" },
      { deliverable: "Short-Form Videos", brandFoundation: "2", growthPackage: "4", agencyPartner: "8" },
      { deliverable: "Community Management", brandFoundation: "-", growthPackage: "Basic", agencyPartner: "Full" },
      {
        deliverable: "Content Writing",
        brandFoundation: "Yes",
        growthPackage: "Yes",
        agencyPartner: "Yes",
      },
      {
        deliverable: "Posting/Scheduling",
        brandFoundation: "Yes",
        growthPackage: "Yes",
        agencyPartner: "Yes",
      },
    ],
  },
  {
    serviceArea: "Paid Advertising",
    serviceAreaSubtitle: "(Ad spend separate)",
    rows: [
      { deliverable: "Ad Platforms", brandFoundation: "-", growthPackage: "1", agencyPartner: "3" },
      { deliverable: "Active Campaigns", brandFoundation: "-", growthPackage: "1", agencyPartner: "3" },
      { deliverable: "Ad Variations / Month", brandFoundation: "-", growthPackage: "2", agencyPartner: "4" },
      { deliverable: "Optimization Frequency", brandFoundation: "-", growthPackage: "Monthly", agencyPartner: "Bi-weekly" },
      { deliverable: "Conversion Tracking", brandFoundation: "-", growthPackage: "Basic", agencyPartner: "Advanced" },
    ],
  },
  {
    serviceArea: "Email Marketing",
    rows: [
      { deliverable: "Campaigns / Month", brandFoundation: "1", growthPackage: "2", agencyPartner: "4" },
      { deliverable: "Automation Flows", brandFoundation: "-", growthPackage: "1", agencyPartner: "2" },
      { deliverable: "Audience Segmentation", brandFoundation: "Basic", growthPackage: "Intermediate", agencyPartner: "Advanced" },
    ],
  },
  {
    serviceArea: "SEO",
    rows: [
      { deliverable: "Keyword Research", brandFoundation: "3 keywords", growthPackage: "5 keywords", agencyPartner: "10 keywords" },
      { deliverable: "On-Page Optimization", brandFoundation: "3 pages", growthPackage: "Priority pages", agencyPartner: "Complete website" },
      { deliverable: "Blog Content", brandFoundation: "1 blog/month", growthPackage: "2 blogs/month", agencyPartner: "4 blogs/month" },
      { deliverable: "Technical SEO", brandFoundation: "-", growthPackage: "Basic fixes", agencyPartner: "Advanced optimization" },
      { deliverable: "SEO Monitoring", brandFoundation: "-", growthPackage: "Search Console", agencyPartner: "Advanced tracking" },
    ],
  },
  {
    serviceArea: "Website & Funnels",
    rows: [
      { deliverable: "Landing Pages", brandFoundation: "-", growthPackage: "1/month", agencyPartner: "1/month + optimization" },
      { deliverable: "Conversion Optimization (CRO)", brandFoundation: "-", growthPackage: "-", agencyPartner: "Included" },
      { deliverable: "Website Support", brandFoundation: "-", growthPackage: "2 hours/month", agencyPartner: "4 hours/month" },
    ],
  },
  {
    serviceArea: "Strategy & Reporting",
    rows: [
      { deliverable: "Performance Reports", brandFoundation: "Monthly", growthPackage: "Monthly", agencyPartner: "Monthly" },
      { deliverable: "Strategy Calls", brandFoundation: "-", growthPackage: "Monthly", agencyPartner: "Bi-weekly" },
    ],
  },
  {
    serviceArea: "Commitment",
    rows: [
      { deliverable: "Recommended Commitment", brandFoundation: "3 months", growthPackage: "3 months", agencyPartner: "3-6 months" },
    ],
  },
];

export default function PricingComparisonTable() {
  return (
    <section className="td-pricing-comparison-area pt-130 pb-130" aria-label="Pricing comparison">
      <div className="container">
        <div className="td-pricing-comparison-title-wrap text-center">
          <h2 className="td-section-page-title td-pricing-comparison-title">Package Details</h2>
        </div>
        <div className="td-pricing-comparison-scroll" role="region" aria-label="Pricing comparison table" tabIndex={0}>
          <div className="td-pricing-comparison-scroll-inner">
            <table className="td-pricing-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="td-pricing-col-sticky">Service Area</th>
                <th scope="col">Deliverable</th>
                <th scope="col">Brand Foundation</th>
                <th scope="col">Growth Package</th>
                <th scope="col">Agency Partner</th>
              </tr>
            </thead>
            {comparisonGroups.map((group, groupIndex) => (
              <tbody key={group.serviceArea}>
                {group.rows.map((row, rowIndex) => (
                  <tr key={`${group.serviceArea}-${row.deliverable}`} className={rowIndex === 0 ? "td-pricing-group-start" : ""}>
                    {rowIndex === 0 ? (
                      <th scope="rowgroup" rowSpan={group.rows.length} className="td-pricing-col-sticky td-pricing-service-area">
                        {group.serviceArea}
                        {group.serviceAreaSubtitle && (
                          <span className="td-pricing-service-area-sub">{group.serviceAreaSubtitle}</span>
                        )}
                      </th>
                    ) : null}
                    <th scope="row" className="td-pricing-deliverable">
                      <span className="td-pricing-deliverable-cell">
                        <span className="td-pricing-deliverable-label">{row.deliverable}</span>
                        {deliverableTooltips[row.deliverable] && (
                          <span
                            className={`td-pricing-deliverable-tooltip-wrap${groupIndex === 0 && rowIndex === 0 ? " td-pricing-deliverable-tooltip-below" : ""}`}
                            tabIndex={0}
                            aria-label={`Info: ${deliverableTooltips[row.deliverable]}`}
                          >
                            <span className="td-pricing-deliverable-info-icon" aria-hidden>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <circle cx="8" cy="5.5" r="1" fill="currentColor" />
                                <line x1="8" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </span>
                            <span className="td-pricing-deliverable-tooltip" role="tooltip">{deliverableTooltips[row.deliverable]}</span>
                          </span>
                        )}
                      </span>
                    </th>
                    <td>{row.brandFoundation}</td>
                    <td>{row.growthPackage}</td>
                    <td>{row.agencyPartner}</td>
                  </tr>
                ))}
              </tbody>
            ))}
            <tbody>
              <tr className="td-pricing-cta-row">
                <th scope="row" className="td-pricing-col-sticky td-pricing-service-area">Ready to Start?</th>
                <th scope="row" className="td-pricing-deliverable">Pricing</th>
                <td className="td-pricing-cta-cell">
                  <div className="td-pricing-cta-cell-inner">
                    <span className="td-pricing-cta-price">{pricing_data[0].price}</span>
                    <Link className="td-pricing-cta-box" href="/contact" aria-label="Get started with Brand Foundation">Get Started</Link>
                  </div>
                </td>
                <td className="td-pricing-cta-cell">
                  <div className="td-pricing-cta-cell-inner">
                    <span className="td-pricing-cta-price">{pricing_data[1].price}</span>
                    <Link className="td-pricing-cta-box" href="/contact" aria-label="Get started with Growth Package">Get Started</Link>
                  </div>
                </td>
                <td className="td-pricing-cta-cell">
                  <div className="td-pricing-cta-cell-inner">
                    <span className="td-pricing-cta-price">{pricing_data[2].price}</span>
                    <Link className="td-pricing-cta-box" href="/contact" aria-label="Get started with Agency Partner">Get Started</Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  );
}
