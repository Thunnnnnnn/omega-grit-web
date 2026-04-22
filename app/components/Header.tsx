"use client";

import { Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import useMenuStore from "@/store/useMenuStore";

export default function Header() {
  const router = useRouter();
  const store = useAuthStore();
  const menuStore = useMenuStore();

  const handleLogin = () => {
    router.push("/login");
  };

  const goToUserPage = () => {
    router.push("/user");
  };

  const toggleCollapsed = () => {
    menuStore.setCollapsed(!menuStore.collapsed);
  };

  return (
    <div className="min-w-full min-h-[80px] bg-[#8B4513] flex items-center justify-between px-4 border-b border-solid border-black/[.08] dark:border-white/[.145]">
      <div className="flex gap-3">
        <div className="mt-4 lg:hidden flex items-center justify-center">
          <Button
            color="default"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            {menuStore.collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </Button>
        </div>
        <span className="font-semibold lg:text-xl text-md text-white flex items-center">
          จองคิวสำหรับอาบน้ำตัดขนสัตว์เลี้ยง🐶🐱
        </span>
      </div>
      {!store.user ? (
        <Button
          color="default"
          variant="outlined"
          type="primary"
          className="text-[#8B4513]"
          size="large"
          onClick={handleLogin}
        >
          เข้าสู่ระบบ
        </Button>
      ) : (
        <div className="flex gap-6">
          <Avatar
            size={40}
            style={{
              backgroundColor: "#ffffff",
              color: "#8B4513",
              cursor: "pointer",
            }}
            onClick={goToUserPage}
          >
            {store.user?.firstname[0] || ""} {store.user?.lastname[0] || ""}
          </Avatar>
        </div>
      )}
    </div>
  );
}
