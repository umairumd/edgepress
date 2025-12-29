export interface PortfolioItem {
    id: number;
    page: string;
    img: string;
    title: string;
    tag: string;
    category: string;
}

const portfolio_data: PortfolioItem[] = [
    {
        id: 1,
        page: "portfolio_1",
        img: "/assets/img/portfolio/two-columns/thumb.jpg",
        title: "Ukulele",
        tag: "BRANDING",
        category: "prof prof1"
    },
    {
        id: 2,
        page: "portfolio_1",
        img: "/assets/img/portfolio/two-columns/thumb-2.jpg",
        title: "Balenciaga",
        tag: "DIGITAL",
        category: "prof2 prof4"
    },
    {
        id: 3,
        page: "portfolio_1",
        img: "/assets/img/portfolio/two-columns/thumb-3.jpg",
        title: "Circoloco",
        tag: "AGENCY",
        category: "prof1 prof3"
    },
    {
        id: 4,
        page: "portfolio_1",
        img: "/assets/img/portfolio/two-columns/thumb-4.jpg",
        title: "Montana",
        tag: "MARKETING",
        category: "prof3 prof1"
    },
    {
        id: 5,
        page: "portfolio_1",
        img: "/assets/img/portfolio/two-columns/thumb-5.jpg",
        title: "Harmour",
        tag: "VISUAL",
        category: "prof2 prof4"
    },
    {
        id: 6,
        page: "portfolio_1",
        img: "/assets/img/portfolio/two-columns/thumb-6.jpg",
        title: "Fiedunit",
        tag: "Agency",
        category: "prof prof1"
    },

    // portfolio_2
    {
        id: 7,
        page: "portfolio_2",
        img: "/assets/img/portfolio/three-columns/thumb.jpg",
        title: "Balenciaga",
        tag: "DIGITAL",
        category: "prof prof1"
    },
    {
        id: 8,
        page: "portfolio_2",
        img: "/assets/img/portfolio/three-columns/thumb-2.jpg",
        title: "Grinks",
        tag: "STUDIO",
        category: "prof2 prof4"
    },
    {
        id: 9,
        page: "portfolio_2",
        img: "/assets/img/portfolio/three-columns/thumb-3.jpg",
        title: "Suppar",
        tag: "DIGITAL",
        category: "prof1 prof3"
    },
    // Add more if needed, but these are the main ones from the template
];

export default portfolio_data;
