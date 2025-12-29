interface DataType {
    id: number;
    title: string;
    desc: string;
    price: string;
    priceNote?: string;
    list: string[];
    active?: string;
}

const pricing_data: DataType[] = [
    {
        id: 1,
        title: "Brand Foundation",
        desc: "Build credibility. Get ready to grow.",
        price: "$500 – $900",
        list: [
            "Brand & messaging alignment",
            "Website (1–3 pages) or refresh",
            "Content writing (site + social)",
            "Social media setup + initial posts",
            "Basic SEO setup",
            "Email setup & starter campaigns",
            "Analytics & tracking",
            "One time setup",
        ],
    },
    {
        id: 2,
        title: "Growth Package",
        desc: "Consistent visibility & growth.",
        price: "$600 – $1,200 / mo",
        list: [
            "Social media management",
            "Short-form content (reels, carousels)",
            "Content writing & design",
            "Website updates & landing pages",
            "Email campaigns & basic automations",
            "Ongoing SEO optimization",
            "Monthly reporting & strategy",
            "Priority support",
        ],
        active: "greens",
    },
    {
        id: 3,
        title: "Agency Partner",
        desc: "Scale with a dedicated growth team.",
        price: "$1,500 – $3,000 / mo",
        list: [
            "Everything in Growth Package",
            "Paid ads (Meta & Google)",
            "Funnels & conversion optimization",
            "Advanced email flows",
            "Shopify / WordPress development",
            "A/B testing & experiments",
            "Dedicated account strategist",
            "Priority support",
        ],
    },
];

export default pricing_data;
