"use client";

import { useEffect, useState } from "react";
import { Input, Button, notification, Card, Modal } from "antd";
import { userService } from "@/services/user.service";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

export default function EditUserPage() {
  const router = useRouter();
  const store = useAuthStore();
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const backToUser = () => {
    router.push("/user");
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const res = await userService.updateUser(Number(store.user!.id!), {
      email,
      firstname,
      lastname,
      phone,
    });

    if (res.status) {
      api.success({
        title: "แก้ไขข้อมูลผู้ใช้สำเร็จ",
      });

      store.setUser({
        ...res.data,
        id: store.user!.id!,
      });
    } else {
      api.error({
        title: res.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้",
      });
    }

    setConfirmLoading(false);
    setOpen(false);
    setTimeout(() => {
      backToUser();
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const checkPhoneNumber = (value: string) => {
    // อนุญาตให้กรอกเฉพาะตัวเลขและเครื่องหมายบวก
    const regex = /^[0-9+]*$/;
    if (regex.test(value)) {
      setPhone(value);
    }
  };

  useEffect(() => {
    const userData = store.user;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(userData ? userData.email : "");
    setFirstname(userData ? userData.firstname : "");
    setLastname(userData ? userData.lastname : "");
    setPhone(userData ? userData.phone : "");
  }, []);

  return (
    <div className="flex flex-col flex-1 font-sans dark:bg-black p-10">
      {contextHolder}
      <Card>
        <span className="text-3xl font-bold">แก้ไขข้อมูลผู้ใช้</span>
        <div className="flex flex-col mt-6 gap-4">
          <Input
            placeholder="อีเมล"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        title="ยืนยันการแก้ไขข้อมูลผู้ใช้"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการยืนยันการแก้ไขข้อมูลผู้ใช้หรือไม่?</p>
      </Modal>
    </div>
  );
}
