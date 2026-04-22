"use client";

import { Button, Card, Modal, notification, Table, Tag } from "antd";
import useAuthStore from "@/store/useAuthStore";
import { userService } from "@/services/user.service";
import { useEffect, useRef, useState } from "react";
import type { TableProps } from "antd";
import { Queue } from "@/types/queue";
import { queueService } from "@/services/queue.service";
import { useRouter } from "next/navigation";

interface DataType {
  key: string;
  name: string;
  typeOfAnimal: string;
  typeOfQueue: string;
  meetTime: string;
}

export default function UserPage() {
  const store = useAuthStore();
  const hasRun = useRef(false);
  const [api, contextHolder] = notification.useNotification();
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "รหัสคิว",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">#{text}</span>,
    },
    {
      title: "ประเภทคิว",
      dataIndex: "typeOfQueue",
      key: "typeOfQueue",
    },
    {
      title: "ประเภทสัตว์เลี้ยง",
      dataIndex: "typeOfAnimal",
      key: "typeOfAnimal",
    },
    {
      title: "เวลานัดหมาย",
      key: "meetTime",
      dataIndex: "meetTime",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "สถานะ",
      key: "status",
      render: (data) => {
        if (new Date(data.meetTime) > new Date()) {
          return <Tag color="blue">รอนัดหมาย</Tag>;
        } else {
          return <Tag color="green">เข้าพบแล้ว</Tag>;
        }
      },
    },
    {
      title: "",
      key: "action",
      render: (data) => {
        if (new Date(data.meetTime) > new Date()) {
          return (
            <div className="flex gap-3">
              <Button
                type="primary"
                onClick={() => {
                  router.push(`/user/edit-queue/${data.key}`);
                }}
              >
                แก้ไขคิว
              </Button>
              <Button danger onClick={showModal}>
                ยกเลิกคิว
              </Button>
            </div>
          );
        }
      },
    },
  ];

  const router = useRouter();
  const [data, setData] = useState<DataType[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const res = await queueService.deleteQueue(Number(data[0].key));

    if (res.status) {
      api.success({
        title: "ยกเลิกคิวสำเร็จ",
      });

      const newData = await userService.getQueuesByUserId(
        store.user?.id as number,
      );
      if (newData.status) {
        const formattedData: DataType[] = newData.data.map((queue: Queue) => ({
          key: queue.id.toString(),
          name: queue.name,
          typeOfQueue: queue.typeOfQueue.name,
          typeOfAnimal: queue.typeOfAnimal.name,
          meetTime: queue.meetTime.toString(),
        }));
        setData(formattedData);
      } else {
        api.error({
          title: newData.message,
        });
      }
    } else {
      api.error({
        title: res.message,
      });
    }
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchQueues = async () => {
      const res = await userService.getQueuesByUserId(store.user?.id as number);
      if (res.status) {
        const newData: DataType[] = res.data.map((queue: Queue) => ({
          key: queue.id.toString(),
          name: queue.name,
          typeOfQueue: queue.typeOfQueue.name,
          typeOfAnimal: queue.typeOfAnimal.name,
          meetTime: queue.meetTime.toString(),
        }));
        setData(newData);
      }
    };

    fetchQueues();
  }, []);

  const handleLogout = () => {
    api.success({
      title: "ออกจากระบบสำเร็จ",
    });
    localStorage.removeItem("token");
    setToken(null);
    store.setUser(null);
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  const goToChangePassword = () => {
    router.push("/user/change-password");
  };

  const goToEditUser = () => {
    router.push("/user/edit");
  };

  return (
    <div className="p-10 flex flex-col flex-1 font-sans dark:bg-black">
      {contextHolder}
      <Card>
        <div className=" flex justify-between">
          <span className="text-3xl font-bold">ข้อมูลผู้ใช้</span>
          <div className="flex gap-3">
            <Button onClick={goToEditUser}>แก้ไขข้อมูล</Button>
            <Button
              variant="outlined"
              color="blue"
              onClick={goToChangePassword}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
            <Button
              variant="outlined"
              className="text-[#8B4513]"
              onClick={handleLogout}
              danger
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
        <div className="text-lg mt-6">
          ชื่อ: {store.user?.firstname} {store.user?.lastname}
        </div>
        <div className="text-lg mt-2">อีเมล: {store.user?.email}</div>
        <div className="text-lg mt-2">เบอร์โทรศัพท์: {store.user?.phone}</div>

        <div className="text-xl mt-6 font-semibold">คิวที่จอง</div>
        <div className="mt-2">
          <Table columns={columns} dataSource={data}></Table>
        </div>
      </Card>

      <Modal
        title="ยกเลิกการจองคิว"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{ danger: true }}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการยืนยันการยกเลิกคิวหรือไม่?</p>
      </Modal>
    </div>
  );
}
