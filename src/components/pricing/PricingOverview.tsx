import Link from "next/link";

type OverviewPackage = {
  name: string;
  description: string;
  highlights: string[];
  featured?: boolean;
};

const packages: OverviewPackage[] = [
  {
    name: "Brand Foundation",
    description: "Build consistent visibility and establish your digital foundation.",
    highlights: [
      "Social media management (2 platforms)",
      "8 posts + 2 short-form videos",
      "Foundational SEO",
      "Email campaign support",
      "Monthly reporting",
    ],
  },
  {
    name: "Growth Package",
    description: "Structured growth with organic + paid lead generation.",
    highlights: [
      "3 platforms + 12 posts",
      "Paid ads management (1 platform)",
      "2 SEO blogs per month",
      "Email automation",
      "Monthly strategy call",
    ],
    featured: true,
  },
  {
    name: "Agency Partner",
    description: "Full performance-focused system for scaling brands.",
    highlights: [
      "4 platforms + advanced content",
      "Multi-platform paid ads",
      "Technical SEO & authority growth",
      "Conversion optimization",
      "Bi-weekly performance reviews",
    ],
  },
];

export default function PricingOverview() {
  return (
    <section className="td-pricing-overview-area pt-130 pb-130" aria-labelledby="pricing-overview-title">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-8 col-xl-9 col-lg-10">
            <div className="td-pricing-overview-title-wrap text-center mb-65">
              <h2 id="pricing-overview-title" className="td-section-6-bigtitle td-text-opacity mb-15">
                Scale With Confidence
              </h2>
              <p className="td-pricing-overview-subtitle mb-0">
                Flexible growth packages built for different stages of business.
              </p>
            </div>
          </div>
        </div>

        <div className="row td-pricing-overview-row">
          {packages.map((item) => (
            <div key={item.name} className="col-xl-4 col-lg-6 col-md-6">
              <article
                className={`td-pricing-overview-card mb-30 ${item.featured ? "td-pricing-overview-card--featured" : ""}`.trim()}
                aria-label={item.name}
              >
                <div className="td-pricing-overview-card-top">
                  {item.featured ? <span className="td-pricing-overview-badge">Most Popular</span> : null}
                  <h3 className="td-pricing-overview-package mb-15">{item.name}</h3>
                  <p className="td-pricing-overview-desc mb-0">{item.description}</p>
                </div>

                <div className="td-pricing-overview-list-wrap">
                  <ul className="td-pricing-overview-list">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <Link className="td-pricing-overview-btn" href="/pricing" aria-label={`View full details for ${item.name}`}>
                    View Full Details
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
