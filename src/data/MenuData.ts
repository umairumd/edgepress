interface MenuItem {
    id: number;
    title: string;
    link: string;
    has_dropdown: boolean;
    is_unclickable?: boolean; // For menu items that should not be clickable (like "More")
    sub_menus?: {
        link: string;
        title: string;
    }[];
}

const menu_data: MenuItem[] = [
    {
        id: 1,
        title: "Home",
        link: "/",
        has_dropdown: false,
    },
    {
        id: 3,
        title: "Services",
        link: "/service",
        has_dropdown: false,
    },
    {
        id: 4,
        title: "Portfolio",
        link: "/portfolio",
        has_dropdown: false,
    },
    {
        id: 5,
        title: "About",
        link: "/about",
        has_dropdown: false,
    },
    {
        id: 7,
        title: "More",
        link: "#",
        has_dropdown: true,
        is_unclickable: true,
        sub_menus: [
            { link: "/team", title: "Team" },
            { link: "/pricing", title: "Pricing" },
            { link: "/contact", title: "Contact" },
        ],
    },
    {
        id: 6,
        title: "Blog",
        link: "/blog",
        has_dropdown: false,
    },
];

export default menu_data;
