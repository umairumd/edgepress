"use client";
import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowRight } from "@/components/icons";

interface DataType {
    id: number;
    slug?: string;
    sub_title?: string;
    title: string;
    desc: ReactNode;
    list?: string[];
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
        title: "Strategy Before Execution",
        desc: (
            <>
                <p>We start with your business goals, not a template. Every engagement begins with understanding what you are trying to achieve, who you are trying to reach, and what stands between you and that outcome.</p>
                <ul>
                    <li>Market & competitor research</li>
                    <li>Goal alignment workshops</li>
                    <li>Custom growth roadmap</li>
                </ul>
            </>
        ),
    },
    {
        id: 2,
        title: "Full-Service, One Team",
        desc: (
            <>
                <p>From brand to development to marketing — everything is handled in-house. No handoffs, no miscommunication, no outsourcing surprises. One team owns the outcome end to end.</p>
                <ul>
                    <li>Brand, design & development</li>
                    <li>SEO, paid media & content</li>
                    <li>Single point of accountability</li>
                </ul>
            </>
        ),
    },
    {
        id: 3,
        title: "Measurable Outcomes",
        desc: (
            <>
                <p>Every engagement is tied to KPIs that matter to your business. We track, report, and adjust — so results are visible, not assumed. You always know what is working and why.</p>
                <ul>
                    <li>KPI definition & tracking</li>
                    <li>Monthly reporting & analysis</li>
                    <li>Transparent performance data</li>
                </ul>
            </>
        ),
    },
    {
        id: 4,
        title: "Built for the Long Term",
        desc: (
            <>
                <p>We build systems that compound over time — SEO that grows, brands that stick, and websites that scale. Not quick wins that fade. Everything we build is designed to keep working.</p>
                <ul>
                    <li>Scalable technical foundations</li>
                    <li>Brand systems that evolve</li>
                    <li>Long-term growth strategy</li>
                </ul>
            </>
        ),
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
                                        {item.list && (
                                            <ul>
                                                {item.list.map((list, i) => (
                                                    <li key={i}>{list}</li>
                                                ))}
                                            </ul>
                                        )}
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
