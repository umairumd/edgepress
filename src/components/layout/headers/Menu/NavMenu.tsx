"use client";
import Link from "next/link";
import menu_data from "@/data/MenuData";

const NavMenu = () => {
    return (
        <ul className="navigation">
            {menu_data.map((menu) => (
                <li key={menu.id} className={menu.has_dropdown ? "menu-item-has-children" : ""}>
                    <Link href={menu.link}>
                        {menu.title}
                    </Link>

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
