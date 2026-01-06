"use client";
import { useCallback, useEffect, useRef } from "react";
import type { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowRight } from "@/components/icons";

interface DataType {
    id: number;
    slug: string;
    sub_title: string;
    title: string;
    desc: JSX.Element;
    list: string[];
}

const serviceThumbs: string[] = [
    "/assets/img/service/service-imgs-11.jpg",
    "/assets/img/service/service-imgs-12.jpg",
    "/assets/img/service/service-imgs-13.jpg",
    "/assets/img/service/service-imgs-14.jpg",
    "/assets/img/service/service-imgs-15.jpg",
];

const service_data: DataType[] = [
    {
        id: 1,
        slug: "business-strategy",
        sub_title: "Clarity before execution.",
        title: "Business Strategy",
        desc: (<>Everything starts here. Strategy defines what to do, why to do it, and what not to do. Without this, marketing becomes noise.</>),
        list: [
            "Growth & positioning strategy",
            "Market & competitor analysis",
            "Funnel & execution roadmap",
        ],
    },
    {
        id: 2,
        slug: "ui-ux-design",
        sub_title: "Designing how users think and move.",
        title: "UI / UX Design",
        desc: (<>Before building or marketing anything, we design the experience — how users navigate, understand, and convert.</>),
        list: [
            "User flows & wireframing",
            "Prototyping & interface design",
            "Usability-focused layouts",
            "Tools: Figma, Adobe XD",
        ],
    },
    {
        id: 3,
        slug: "web-development",
        sub_title: "Turning strategy into a functional platform.",
        title: "Web Development",
        desc: (<>Once the experience is defined, we build fast, scalable websites that support conversions and growth.</>),
        list: [
            "Custom website development",
            "WordPress & Shopify builds",
            "Responsive & performance optimization",
            "Tech: HTML, CSS, JavaScript, WordPress, Shopify",
        ],
    },
    {
        id: 4,
        slug: "ecommerce-store-development",
        sub_title: "Commerce-focused execution.",
        title: "E-Commerce Store Development",
        desc: (<>E-commerce deserves its own spotlight. This is where strategy, UX, and development come together to drive sales.</>),
        list: [
            "Shopify & WooCommerce stores",
            "Product & payment setup",
            "Conversion-focused layouts",
        ],
    },
    {
        id: 5,
        slug: "graphics-designing",
        sub_title: "Visual consistency across every touchpoint.",
        title: "Graphics Designing",
        desc: (<>Design supports trust, recall, and professionalism — across social media, websites, ads, and brand assets.</>),
        list: [
            "Brand visuals & social creatives",
            "Marketing & promotional designs",
            "Print & digital assets",
            "Tools: Adobe Illustrator, Photoshop, InDesign",
        ],
    },
    {
        id: 6,
        slug: "digital-marketing",
        sub_title: "Distribution, visibility, and demand generation.",
        title: "Digital Marketing",
        desc: (<>Once the foundation is solid, we drive traffic and attention through aligned, multi-channel marketing.</>),
        list: [
            "Paid ads & campaign management",
            "Social media marketing",
            "Lead generation & optimization",
            "Platforms: Google, Facebook, Instagram, LinkedIn, Twitter",
        ],
    },
    {
        id: 7,
        slug: "seo-services",
        sub_title: "Sustainable, intent-driven growth.",
        title: "SEO Services",
        desc: (<>SEO compounds over time. It strengthens everything else by capturing demand that already exists.</>),
        list: [
            "Technical SEO",
            "Content-driven SEO",
            "On-page & off-page optimization",
        ],
    },
    {
        id: 8,
        slug: "app-development",
        sub_title: "Product-level execution for scalable ideas.",
        title: "App Development",
        desc: (<>Apps come after clarity, demand, and validation — not before. This keeps your positioning mature and strategic.</>),
        list: [
            "Cross-platform mobile apps",
            "Android & iOS development",
            "Performance optimization",
            "Tech: Flutter, Android Studio",
        ],
    },
];

const ServiceItem = () => {
    const rafRef = useRef<number | null>(null);
    const scrollTriggerRef = useRef<{ refresh?: () => void } | null>(null);

    const refreshTriggers = useCallback(() => {
        if (typeof window === "undefined") return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            try {
                scrollTriggerRef.current?.refresh?.();
            } catch {
                // ignore
            }
        });
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            let cancelled = false;
            let mm: { add?: (query: string, setup: () => void) => void; revert?: () => void } | null = null;

            (async () => {
                const gsapMod = await import("gsap");
                const gsap = gsapMod.default;
                const stMod = await import("gsap/ScrollTrigger");
                const ScrollTrigger = stMod.default;
                gsap.registerPlugin(ScrollTrigger);
                scrollTriggerRef.current = ScrollTrigger;

                if (cancelled) return;

                mm = gsap.matchMedia();
                mm.add?.("(min-width: 991px)", () => {
                    const panels = document.querySelectorAll(".td-service-pin-item-panel");

                    panels.forEach((panel) => {
                        gsap.to(panel, {
                            scrollTrigger: {
                                trigger: panel,
                                start: "top top",
                                end: "bottom 100%",
                                pin: true,
                                pinSpacing: false,
                                scrub: true,
                                markers: false,
                                endTrigger: ".td-service-pin-items",
                            },
                        });
                    });
                    // Fonts/images may load after this runs; refresh once.
                    refreshTriggers();
                });

                // One more refresh shortly after mount for stability.
                setTimeout(() => refreshTriggers(), 50);
            })().catch(() => {
                // ignore dynamic import failures
            });

            return () => {
                cancelled = true;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                mm?.revert?.();
            };
        }
    }, [refreshTriggers]);

    return (
        <div className="td-service-pin-item td-service-pin-items">
            <div className="container-fluid p-0">
                {service_data.map((item, index) => (
                    <div key={item.id} className="black-bg td-service-pin-item-panel">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="td-service-pin-thumb">
                                    <Image
                                        className="w-100"
                                        src={serviceThumbs[index % serviceThumbs.length]}
                                        alt={item.title}
                                        width={1200}
                                        height={800}
                                        sizes="(max-width: 991px) 100vw, 50vw"
                                        style={{ height: "auto" }}
                                        priority={index === 0}
                                        onLoadingComplete={refreshTriggers}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="td-service-pin-content-inner pt-40 pb-40 ml-100">
                                    <div className="td-service-pin-subtitle mb-15">
                                        <span className="number">0{index + 1}</span>
                                    </div>
                                    <h2 className="td-service-pin-title mb-30">{item.title}</h2>
                                    <div className="td-service-pin-content  ml-50">
                                        <div className="mb-40">{item.desc}</div>
                                        <ul>
                                            {item.list.map((list, i) => (
                                                <li key={i}>{list}</li>
                                            ))}
                                        </ul>
                                        <div className="td-btn-group td-btn-group-border pt-50">
                                            <Link className="td-btn-circle" href="/contact" aria-label="Reach out">
                                                <IconArrowRight />
                                            </Link>
                                            <Link className="td-btn-2 td-btn-primary" href="/contact">REACH OUT</Link>
                                            <Link className="td-btn-circle" href="/contact" aria-label="Reach out">
                                                <IconArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default ServiceItem;
