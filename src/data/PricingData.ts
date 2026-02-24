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
        desc: "Build your digital foundation with structure and clarity.",
        price: "$499/mo",
        list: [
            "Social Media: Structured presence across 2 platforms",
            "Paid Ads: Ad infrastructure & tracking setup",
            "SEO: On-page optimization & keyword groundwork",
            "Email: Campaign setup & execution",
            "Strategy & Reporting: Monthly performance insights",
        ],
    },
    {
        id: 2,
        title: "Growth Package",
        desc: "Turn visibility into consistent lead flow.",
        price: "$999/mo",
        list: [
            "Social Media: Growth-focused content across 3 platforms",
            "Paid Ads: Managed campaigns on one primary platform",
            "SEO: Ongoing content optimization & search positioning",
            "Email: Campaigns + automation sequences",
            "Strategy & Reporting: Monthly strategy session & reporting",
        ],
        active: "greens",
    },
    {
        id: 3,
        title: "Agency Partner",
        desc: "Operate a fully integrated growth system.",
        price: "$1499/mo",
        list: [
            "Social Media: Multi-platform content engine",
            "Paid Ads: Cross-platform performance management",
            "SEO: Technical optimization, authority building & scaling",
            "Email: Advanced automation & lifecycle campaigns",
            "Strategy & Reporting: Bi-weekly growth reviews & roadmap planning",
        ],
    },
];

export default pricing_data;
