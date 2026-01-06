"use client";
import Link from "next/link";
import { useState } from "react";
import menu_data from "@/data/MenuData";
import { IconAngleRight } from "@/components/icons";

const MobileMenu = () => {
    const [navTitle, setNavTitle] = useState("");

    // openMobileMenu
    const openMobileMenu = (menu: string) => {
        if (navTitle === menu) {
            setNavTitle("");
        } else {
            setNavTitle(menu);
        }
    };

    return (
        <ul className="navigation">
            {menu_data.map((menu) => (
                <li
                    key={menu.id}
                    className={`${menu.has_dropdown ? "menu-item-has-children" : ""} ${navTitle === menu.title ? "active" : ""}`}
                >
                    <Link href={menu.link} className={menu.has_dropdown ? "" : ""}>{menu.title}</Link>
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
                                        <Link href={sub_m.link}>{sub_m.title}</Link>
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
