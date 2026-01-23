"use client";
import Link from "next/link";
import { useState } from "react";
import menu_data from "@/data/MenuData";
import { IconAngleRight } from "@/components/icons";

interface MobileMenuProps {
    onNavigate?: () => void;
}

const MobileMenu = ({ onNavigate }: MobileMenuProps) => {
    const [navTitle, setNavTitle] = useState("");

    // openMobileMenu
    const openMobileMenu = (menu: string) => {
        if (navTitle === menu) {
            setNavTitle("");
        } else {
            setNavTitle(menu);
        }
    };

    // Handle link click - close menu on navigation
    const handleLinkClick = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <ul className="navigation">
            {menu_data.map((menu) => (
                <li
                    key={menu.id}
                    className={`${menu.has_dropdown ? "menu-item-has-children" : ""} ${navTitle === menu.title ? "active" : ""}`}
                >
                    {menu.is_unclickable ? (
                        <span className="tdmenu__mobile-unclickable" style={{ cursor: "default" }}>{menu.title}</span>
                    ) : (
                        <Link href={menu.link} onClick={handleLinkClick}>{menu.title}</Link>
                    )}
                    {menu.has_dropdown && (
                        <>
                            <div
                                className={`dropdown-btn ${navTitle === menu.title ? "open" : ""}`}
                                onClick={() => openMobileMenu(menu.title)}
                            >
                                <IconAngleRight />
                            </div>
                            <ul className="sub-menu" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                                {menu.sub_menus?.map((sub_m, i) => (
                                    <li key={i}>
                                        <Link href={sub_m.link} onClick={handleLinkClick}>{sub_m.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default MobileMenu;
