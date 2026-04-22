"use client";

import { Button, Card, Input, Modal, notification } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import useAuthStore from "@/store/useAuthStore";

export default function ChangePasswordPage() {
  const router = useRouter();
  const store = useAuthStore();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    if (newPassword !== confirmPassword) {
      setConfirmLoading(false);
      setOpen(false);
      api.error({
        title: "รหัสผ่านใหม่ไม่ตรงกัน",
      });
      return;
    }

    const res = await userService.changePassword(
      store.user?.id!,
      password,
      newPassword,
    );

    if (res.status) {
      api.success({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
      });
    } else {
      api.error({
        title: res.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
      });
    }
    setConfirmLoading(false);
    setOpen(false);
    setTimeout(() => {
      router.push("/user");
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 font-sans dark:bg-black p-10">
      {contextHolder}
      <Card>
        <span className="text-3xl font-bold">เปลี่ยนรหัสผ่าน</span>
        <div className="flex flex-col mt-6 gap-4">
          <Input
            type="password"
            placeholder="รหัสผ่านเดิม"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          ></Input>
          <Input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
        </div>

        <div className="flex justify-between mt-6">
          <Button color="blue" type="primary" onClick={showModal}>
            ยืนยัน
          </Button>
          <Button danger onClick={() => router.push("/user")}>
            ยกเลิก
          </Button>
        </div>
      </Card>

      <Modal
        title="ยืนยันการเปลี่ยนรหัสผ่าน"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการยืนยันการเปลี่ยนรหัสผ่านหรือไม่?</p>
      </Modal>
    </div>
  );
}
