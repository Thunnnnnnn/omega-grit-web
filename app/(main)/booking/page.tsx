"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  notification,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Modal,
} from "antd";
import { masterDataService } from "@/services/masterData.service";
import { MasterData } from "@/types/masterData";
import dayjs, { Dayjs } from "dayjs";
import { queueService } from "@/services/queue.service";
import useAuthStore from "@/store/useAuthStore";

export default function Home() {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const hasRun = useRef(false);
  const [typeOfQueueOptions, setTypeOfQueueOptions] = useState<MasterData[]>(
    [],
  );
  const [typeOfAnimalId, setTypeOfAnimalId] = useState<number | null>(null);
  const [typeOfQueueId, setTypeOfQueueId] = useState<number | null>(null);
  const [meetDate, setMeetDate] = useState<Dayjs | null>(dayjs());
  const [meetTime, setMeetTime] = useState<Dayjs | null>(
    dayjs("09:00", "HH:mm"),
  );

  const [typeOfAnimalOptions, setTypeOfAnimalOptions] = useState<MasterData[]>(
    [],
  );

  const token = localStorage.getItem("token");
  const store = useAuthStore();

  const fetchMasterData = async () => {
    try {
      const responseQueueOptions = await masterDataService.typeOfQueue();
      if (responseQueueOptions.status) {
        setTypeOfQueueOptions(responseQueueOptions.data);
      }

      const responseAnimalOptions = await masterDataService.typeOfAnimal();
      if (responseAnimalOptions.status) {
        setTypeOfAnimalOptions(responseAnimalOptions.data);
      }
    } catch (error) {
      console.error("Failed to fetch master data:", error);
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      api.error({
        title: "Unauthorized",
        description: "กรุณาเข้าสู่ระบบก่อนจองคิว",
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }

    const fetch = async () => {
      await fetchMasterData();
    };
    fetch();
  }, []);

  const checkTime = (time: Dayjs | null) => {
    if (!time) return;

    if (time.hour() < 9 || time.hour() > 18) {
      api.error({
        title: "กรุณาเลือกเวลาในช่วงเวลาทำการ 09:00 - 18:00",
      });
      return; // ❌ ไม่ให้ set
    }

    if (time.minute() !== 0) {
      api.error({
        title: "กรุณาเลือกเวลาเป็นชั่วโมง เช่น 09:00, 10:00",
      });
      return; // ❌ ไม่ให้ set
    }

    setMeetTime(time);
  };

  const disabledDate = (current: Dayjs) => {
    // Disable weekends (0 = Sunday, 6 = Saturday)
    const day = current.day();
    if (day === 0 || day === 6) return true;

    return false;
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const res = await queueService.addQueue({
      userId: store.user?.id as number,
      typeOfAnimalId: typeOfAnimalId as number,
      typeOfQueueId: typeOfQueueId as number,
      meetTime: dayjs(
        `${meetDate?.format("YYYY-MM-DD")} ${meetTime?.format("HH:mm")}`,
      ).toDate(),
    });

    if (res.status) {
      api.success({
        title: "จองคิวสำเร็จ",
      });
      onReset();
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

  const onReset = () => {
    setTypeOfAnimalId(null);
    setTypeOfQueueId(null);
    setMeetDate(dayjs());
    setMeetTime(dayjs("09:00", "HH:mm"));
  };

  return (
    <div className="flex flex-col flex-1 font-sans dark:bg-black p-10">
      {contextHolder}
      <Card>
        <div className="text-3xl font-bold">จองคิว</div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-6">
          <Select
            options={typeOfAnimalOptions.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="ประเภทสัตว์เลี้ยง"
            value={typeOfAnimalId}
            onChange={(value) => setTypeOfAnimalId(value)}
          ></Select>
          <Select
            options={typeOfQueueOptions.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            value={typeOfQueueId}
            onChange={(value) => setTypeOfQueueId(value)}
            placeholder="ประเภทการจองคิว"
          ></Select>
          <DatePicker
            placeholder="เลือกวันที่"
            value={meetDate}
            onChange={(date) => setMeetDate(date)}
            format="DD/MM/YYYY"
            minDate={dayjs()}
            disabledDate={disabledDate}
          ></DatePicker>
          <TimePicker
            format="HH:mm"
            placeholder="เลือกเวลา"
            value={meetTime}
            onChange={(time) => checkTime(time)}
            defaultValue={dayjs("09:00", "HH:mm")}
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button color="blue" type="primary" onClick={showModal}>
            จองคิว
          </Button>
          <Button onClick={onReset}>รีเซ็ต</Button>
        </div>
      </Card>

      <Modal
        title="ยืนยันการจองคิว"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการยืนยันการจองคิวหรือไม่?</p>
      </Modal>
    </div>
  );
}
