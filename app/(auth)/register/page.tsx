"use client";

import Image from "next/image";
import { useState } from "react";
import { Input, Button, notification } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const backToHome = () => {
    router.push("/");
  };

  const register = async () => {
    if (password !== confirmPassword) {
      api.error({
        title: "รหัสผ่านไม่ตรงกัน",
      });
      return;
    }

    try {
      const res = await authService.register({
        email,
        password,
        firstname,
        lastname,
        phone,
      });

      if (res.status) {
        api.success({
          title: "สมัครสมาชิกสำเร็จ",
        });

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      api.error({
        title: err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      });
    }
  };

  const checkPhoneNumber = (value: string) => {
    // อนุญาตให้กรอกเฉพาะตัวเลขและเครื่องหมายบวก
    const regex = /^[0-9+]*$/;
    if (regex.test(value)) {
      setPhone(value);
    }
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

      <div className="border rounded-md min-h-full w-full lg:w-[40vw] flex flex-col justify-center gap-6 bg-white p-10">
        <Button
          type="primary"
          icon={<RollbackOutlined />}
          style={{ position: "absolute", top: 60, right: 60 }}
          onClick={backToHome}
        >
          กลับสู่หน้าหลัก
        </Button>
        <div className="font-bold text-4xl mb-4 flex justify-center w-full">
          สมัครสมาชิก
        </div>
        <Input
          placeholder="อีเมล"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Input
          placeholder="รหัสผ่าน"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
        <Input
          placeholder="ยืนยันรหัสผ่าน"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></Input>
        <Input
          placeholder="ชื่อ"
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        ></Input>
        <Input
          placeholder="นามสกุล"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        ></Input>
        <Input
          placeholder="เบอร์โทรศัพท์"
          type="text"
          value={phone}
          onChange={(e) => checkPhoneNumber(e.target.value)}
        ></Input>

        <Button
          color="primary"
          variant="solid"
          className="w-full"
          onClick={register}
        >
          สมัครสมาชิก
        </Button>
      </div>
    </div>
  );
}
