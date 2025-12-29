"use client";
import { useEffect, useState, useRef } from "react";

const UseSticky = () => {
    const [sticky, setSticky] = useState(false);
    const ticking = useRef(false);

    const handleStickyNavbar = () => {
        if (!ticking.current) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY >= 200) {
                    setSticky(true);
                } else {
                    setSticky(false);
                }
                ticking.current = false;
            });
            ticking.current = true;
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleStickyNavbar, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleStickyNavbar);
        };
    }, []);

    return { sticky };
};

export default UseSticky;
