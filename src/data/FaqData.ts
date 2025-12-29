export interface FaqItem {
    id: number;
    page: string
    title: string;
    desc: string;
    showAnswer: boolean;
}

const faq_data: FaqItem[] = [
    {
        id: 1,
        page: "home_2",
        showAnswer: false,
        title: "How to start a project?",
        desc: "Some definitions of marketing highlight marketing's ability to produce value to shareholders of the firm as well. In this context",
    },
    {
        id: 2,
        page: "home_2",
        showAnswer: false,
        title: "How does a design agency work?",
        desc: "Some definitions of marketing highlight marketing's ability to produce value to shareholders of the firm as well. In this context",
    },
    {
        id: 3,
        page: "home_2",
        showAnswer: false,
        title: "Crafting a distinctive brand identity for your startup business agency",
        desc: "Some definitions of marketing highlight marketing's ability to produce value to shareholders of the firm as well. In this context",
    },
    {
        id: 4,
        page: "home_2",
        showAnswer: false,
        title: "Why hiring a design agency is essential for business success",
        desc: "Some definitions of marketing highlight marketing's ability to produce value to shareholders of the firm as well. In this context",
    },

    // home_4
    {
        id: 1,
        page: "home_4",
        showAnswer: false,
        title: "Website and mobile app design",
        desc: "We are excited for our work and how it positively impacts clients. With over 12 years of experience we have been constantly providing solutions.",
    },
    {
        id: 2,
        page: "home_4",
        showAnswer: false,
        title: "Website and mobile app design",
        desc: "We are excited for our work and how it positively impacts clients. With over 12 years of experience we have been constantly providing solutions.",
    },
    {
        id: 3,
        page: "home_4",
        showAnswer: false,
        title: "User experience",
        desc: "We are excited for our work and how it positively impacts clients. With over 12 years of experience we have been constantly providing solutions.",
    },

    // inner_faq
    {
        id: 1,
        page: "inner_faq",
        showAnswer: false,
        title: "What exactly does Inoma Digital do?",
        desc: "We’re a full-service growth and creative agency. We handle strategy, content, design, social media, websites, SEO, email marketing, and ads — all aligned under one system focused on real business growth.",
    },
    {
        id: 2,
        page: "inner_faq",
        showAnswer: false,
        title: "Do you offer individual services or custom pricing?",
        desc: "No. We don’t sell isolated services. Our packages are built as complete growth systems. Instead of removing services and adjusting prices, we adjust focus and execution within the package to match your priorities.",
    },
    {
        id: 3,
        page: "inner_faq",
        showAnswer: false,
        title: "What if I don’t need a specific service right now?",
        desc: "That’s fine. If a service isn’t a priority, we simply de-prioritize it and focus more on what matters most for your business — without breaking the system or changing the pricing.",
    },
    {
        id: 4,
        page: "inner_faq",
        showAnswer: false,
        title: "How soon can I expect results?",
        desc: "Most clients see meaningful progress within 30–90 days. The first phase is about setup, alignment, and building a strong foundation. Consistent results follow with execution and optimization.",
    },
    {
        id: 5,
        page: "inner_faq",
        showAnswer: false,
        title: "Who will I be working with?",
        desc: "You’ll have a dedicated Project Manager as your single point of contact, supported by an in-house team of specialists. You don’t need to manage freelancers or chase updates — we handle coordination internally.",
    },
    {
        id: 6,
        page: "inner_faq",
        showAnswer: false,
        title: "Is there a contract or long-term commitment?",
        desc: "We offer flexible options: month-to-month retainers, or 3-month minimums for better momentum. We’ll recommend what makes the most sense for your goals.",
    },
    {
        id: 7,
        page: "inner_faq",
        showAnswer: false,
        title: "What’s the first step to get started?",
        desc: "Book a free strategy call. We’ll understand your business, assess fit, recommend the right package, and clearly explain the next steps if we move forward.",
    },
];

export default faq_data;
