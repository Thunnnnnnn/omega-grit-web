"use client";
import { ClockCircleOutlined, HomeOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useMenuStore from "@/store/useMenuStore";

export default function NavBar() {
  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      type: "group",
      children: [
        {
          key: "Home",
          label: "หน้าหลัก",
          icon: <HomeOutlined />,
        },
        { key: "Booking", label: "จองคิว", icon: <ClockCircleOutlined /> },
      ],
    },
  ];
  const router = useRouter();
  const [routePath, setRoutePath] = useState("");
  const menuStore = useMenuStore();

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(`/${e.key === "Home" ? "" : e.key.toLowerCase()}`);
    menuStore.setCollapsed(true);
    setRoutePath(e.key);
  };

  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoutePath(
      pathname === "/"
        ? "Home"
        : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2),
    );

    menuStore.setCollapsed(true);
  }, [pathname]);

  return (
    <div className="min-h-full text-white items-center justify-center flex">
      <div className="h-full lg:flex items-center hidden justify-center text-2xl font-bold">
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["Home"]}
          selectedKeys={[routePath]}
          mode="inline"
          items={items}
          style={{ width: 256 }}
          className="min-h-full"
        />
      </div>
      <div
        className={`h-full flex items-center lg:hidden justify-center text-2xl font-bold ${menuStore.collapsed ? "w-0" : "w-[160px]"} transition-width duration-300 ease-in-out overflow-hidden`}
        style={{ position: "absolute", top: 80, left: 0, zIndex: 20 }}
      >
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["Home"]}
          selectedKeys={[routePath]}
          mode="inline"
          items={items}
          className="min-h-full"
          style={{ width: "160px" }}
        />
      </div>
    </div>
  );
}
