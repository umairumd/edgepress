"use client";
import { useEffect, useReducer, useRef } from "react";

type State = { sticky: boolean; hidden: boolean };

const UseSticky = () => {
    const [state, setState] = useReducer(
        (_: State, newState: State) => newState,
        { sticky: false, hidden: false }
    );
    const ticking = useRef(false);
    const lastY = useRef(0);
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const handleStickyNavbar = () => {
        if (ticking.current) return;
        ticking.current = true;
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const delta = scrollY - lastY.current;
            const current = stateRef.current;

            let nextSticky = current.sticky;
            let nextHidden = current.hidden;

            if (scrollY < 24) {
                // Near top: normal header
                nextSticky = false;
                nextHidden = false;
            } else if (scrollY >= 220) {
                // Sticky zone
                if (!current.sticky) {
                    // First entry: mount sticky hidden
                    nextSticky = true;
                    nextHidden = true;
                } else {
                    // Already sticky: toggle hidden based on direction
                    nextSticky = true;
                    if (delta > 2) {
                        nextHidden = true;
                    } else if (delta < -2) {
                        nextHidden = false;
                    }
                    // else: keep current hidden state
                }
            }

            // Single atomic update
            if (nextSticky !== current.sticky || nextHidden !== current.hidden) {
                setState({ sticky: nextSticky, hidden: nextHidden });
            }

            lastY.current = scrollY;
            ticking.current = false;
        });
    };

    useEffect(() => {
        lastY.current = window.scrollY;
        window.addEventListener("scroll", handleStickyNavbar, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleStickyNavbar);
        };
    }, []);

    return state;
};

export default UseSticky;
