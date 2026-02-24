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
    serviceAreaSubtitle: "Ad spend separate",
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
            {comparisonGroups.map((group) => (
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
                    <th scope="row" className="td-pricing-deliverable">{row.deliverable}</th>
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
    </section>
  );
}
