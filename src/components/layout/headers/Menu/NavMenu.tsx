"use client";
import Link from "next/link";
import menu_data from "@/data/MenuData";
import { IconAngleDown } from "@/components/icons";

const NavMenu = () => {
    return (
        <ul className="navigation">
            {menu_data.map((menu) => (
                <li key={menu.id} className={menu.has_dropdown ? "menu-item-has-children" : ""}>
                    {menu.is_unclickable ? (
                        <span className="tdmenu__unclickable" style={{ cursor: "default" }} onClick={(e) => e.preventDefault()}>
                            {menu.title}
                            {menu.has_dropdown ? (
                                <span className="tdmenu__dropdown-indicator" aria-hidden="true">
                                    <IconAngleDown />
                                </span>
                            ) : null}
                        </span>
                    ) : (
                        <Link href={menu.link}>
                            {menu.title}
                            {menu.has_dropdown ? (
                                <span className="tdmenu__dropdown-indicator" aria-hidden="true">
                                    <IconAngleDown />
                                </span>
                            ) : null}
                        </Link>
                    )}

                    {menu.has_dropdown && menu.sub_menus && (
                        <ul className="sub-menu">
                            {menu.sub_menus.map((sub_m, i) => (
                                <li key={i}>
                                    <Link href={sub_m.link}>
                                        {sub_m.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default NavMenu;
