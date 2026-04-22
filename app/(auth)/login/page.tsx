"use client";

import Image from "next/image";
import { useState } from "react";
import { Input, Button, notification } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/store/useAuthStore";

export default function Login() {
  const router = useRouter();
  const store = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const login = async () => {
    const response = await authService.login(email, password);
    if (response.status) {
      localStorage.setItem("token", response.data.accessToken);
      store.setUser(response.data.user);
      api.success({
        title: "เข้าสู่ระบบสำเร็จ",
      });
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      api.error({
        title: response.message,
      });
    }
  };

  const backToHome = () => {
    router.push("/");
  };

  const register = () => {
    router.push("/register");
  };

  return (
    <div className="flex h-screen w-screen items-center gap-10 p-10">
      {contextHolder}
      <div
        className="w-[60vw] h-[60vh] hidden lg:block"
        style={{ position: "relative" }}
      >
        <Image src="/login_image.png" alt="Login image" fill />
      </div>

      <div className="border rounded-md min-h-full w-full lg:w-[40vw] flex flex-col items-start justify-center gap-6 bg-white p-10">
        <Button
          type="primary"
          icon={<RollbackOutlined />}
          style={{ position: "absolute", top: 60, right: 60 }}
          onClick={backToHome}
        >
          กลับสู่หน้าหลัก
        </Button>
        <div className="font-bold text-4xl mb-4 flex justify-center w-full">
          Sign in
        </div>
        <Input
          placeholder="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        ></Input>
        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        ></Input>
        <Button
          type="primary"
          className="w-full"
          onClick={login}
          onKeyDown={(e) => e.key === "Enter" && login()}
        >
          เข้าสู่ระบบ
        </Button>

        <Button
          color="primary"
          variant="outlined"
          className="w-full"
          onClick={register}
        >
          สมัครสมาชิก
        </Button>
      </div>
    </div>
  );
}
