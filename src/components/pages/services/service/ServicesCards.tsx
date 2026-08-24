import Link from "next/link";
import type { ServiceListItem } from "@/lib/wp";

function formatSerial(num: number): string {
  return `${num < 10 ? `0${num}` : num}`;
}

interface ServicesCardsProps {
  services?: ServiceListItem[];
}

export default function ServicesCards({ services = [] }: ServicesCardsProps) {
  if (!services.length) return null;

  return (
    <div className="td-services-cards-area td-service-process-area pt-80">
      <div className="container">
        <div className="row gx-0">
          {services.map((item, i) => (
            <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
              <Link
                href={`/services/${item.slug}`}
                className="td-service-process-link"
                aria-label={`Learn more about ${item.title}`}
              >
                <div className="td-service-process-item">
                  <span className="icons mb-40 d-flex align-items-start justify-content-between">
                    <span className="td-services-cards-icon" aria-hidden="true">
                      {item.iconUrl ? (
                        <img
                          src={item.iconUrl}
                          alt=""
                          width={56}
                          height={56}
                          style={{ objectFit: "contain" }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="td-services-cards-icon-placeholder" aria-hidden="true" />
                      )}
                    </span>
                    <span className="number">{formatSerial(i + 1)}</span>
                  </span>
                  <h3 className="title mb-15">{item.title}</h3>
                  <p className="para">{item.excerpt}</p>
                  <div className="td-service-card-cta mt-20">
                    <span className="td-service-card-cta-text">
                      Learn More
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginLeft: "6px" }}
                      >
                        <path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
