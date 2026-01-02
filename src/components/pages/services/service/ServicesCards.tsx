import type { JSX } from "react";

type ServiceCard = {
  id: number;
  title: string;
  desc: string;
  icon: JSX.Element;
  className?: string;
};

// Match the exact visual structure of ServiceProcess cards (same classnames).
const cards: ServiceCard[] = [
  {
    id: 1,
    title: "Business Strategy",
    desc: "Clarity-first planning for measurable growth.",
    icon: <i className="fa-solid fa-chess-knight" aria-hidden="true" />,
  },
  {
    id: 2,
    title: "UI / UX Design",
    desc: "User-first design that improves conversion.",
    icon: <i className="fa-solid fa-compass-drafting" aria-hidden="true" />,
  },
  {
    id: 3,
    title: "Web Development",
    desc: "Fast, scalable sites built to perform.",
    icon: <i className="fa-solid fa-database" aria-hidden="true" />,
  },
  {
    id: 4,
    title: "E-Commerce Store",
    desc: "Storefronts optimized for sales.",
    icon: <i className="fa-solid fa-cart-shopping" aria-hidden="true" />,
  },
  {
    id: 5,
    title: "Graphics Designing",
    desc: "Consistent visuals across every touchpoint.",
    icon: <i className="fa-solid fa-palette" aria-hidden="true" />,
  },
  {
    id: 6,
    title: "Digital Marketing",
    desc: "Multi-channel campaigns aligned to outcomes.",
    icon: <i className="fa-solid fa-bullhorn" aria-hidden="true" />,
  },
  {
    id: 7,
    title: "SEO Services",
    desc: "Sustainable traffic that compounds.",
    icon: <i className="fa-solid fa-magnifying-glass-chart" aria-hidden="true" />,
  },
  {
    id: 8,
    title: "App Development",
    desc: "Mobile products built for scale.",
    icon: <i className="fa-solid fa-mobile-screen-button" aria-hidden="true" />,
  },
];

function formatSerial(num: number): string {
  return `${num < 10 ? `0${num}` : num}`;
}

export default function ServicesCards() {
  return (
    <div className="td-services-cards-area td-service-process-area pt-80">
      <div className="container">
        <div className="row gx-0">
          {cards.map((item, i) => (
            <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
              <div className={`td-service-process-item ${item.className || ""}`.trim()}>
                <span className="icons mb-60 d-flex align-items-start justify-content-between">
                  <span className="td-services-cards-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="number">{formatSerial(i + 1)}</span>
                </span>
                <h3 className="title mb-15">{item.title}</h3>
                <p className="para">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


