"use client";

import { masterDataService } from "@/services/masterData.service";
import { queueService } from "@/services/queue.service";
import { MasterData } from "@/types/masterData";
import {
  Button,
  Card,
  DatePicker,
  Modal,
  notification,
  Select,
  TimePicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EditQueuePage() {
  const router = useRouter();
  const params = useParams();
  const hasRun = useRef(false);
  const [typeOfAnimalId, setTypeOfAnimalId] = useState<number | null>(null);
  const [typeOfQueueId, setTypeOfQueueId] = useState<number | null>(null);
  const [meetDate, setMeetDate] = useState<Dayjs | null>(null);
  const [meetTime, setMeetTime] = useState<Dayjs | null>(null);
  const [typeOfAnimalOptions, setTypeOfAnimalOptions] = useState<MasterData[]>(
    [],
  );
  const [typeOfQueueOptions, setTypeOfQueueOptions] = useState<MasterData[]>(
    [],
  );

  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const res = await queueService.updateQueue(Number(params.id), {
      typeOfAnimalId: typeOfAnimalId!,
      typeOfQueueId: typeOfQueueId!,
      meetTime: dayjs(
        `${meetDate?.format("YYYY-MM-DD")} ${meetTime?.format("HH:mm")}`,
      ).toISOString(),
    });

    if (res.status) {
      api.success({
        title: "แก้ไขข้อมูลการจองคิวสำเร็จ",
      });
    } else {
      api.error({
        title: res.message || "แก้ไขข้อมูลการจองคิวไม่สำเร็จ",
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

  const checkTime = (time: Dayjs | null) => {
    if (!time) return;

    if (time.hour() < 9 || time.hour() > 18) {
      api.error({
        message: "กรุณาเลือกเวลาในช่วงเวลาทำการ 09:00 - 18:00",
      });
      return; // ❌ ไม่ให้ set
    }

    if (time.minute() !== 0) {
      api.error({
        message: "กรุณาเลือกเวลาเป็นชั่วโมง เช่น 09:00, 10:00",
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

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetch = async () => {
      await fetchMasterData();

      const res = await queueService.getQueueById(Number(params.id));

      if (res.status) {
        const queue = res.data;
        setTypeOfAnimalId(queue.typeOfAnimalId);
        setTypeOfQueueId(queue.typeOfQueueId);
        setMeetDate(dayjs(queue.meetTime));
        setMeetTime(dayjs(queue.meetTime));
      } else {
        api.error({
          message: res.message || "ไม่สามารถโหลดข้อมูลคิวได้",
        });
        router.push("/user");
      }
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col flex-1 font-sans dark:bg-black p-10">
      {contextHolder}
      <Card>
        <span className="text-3xl font-bold">แก้ไขข้อมูลการจองคิว</span>
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
            ยืนยัน
          </Button>
          <Button danger onClick={() => router.push("/user")}>
            ยกเลิก
          </Button>
        </div>
      </Card>

      <Modal
        title="ยืนยันการแก้ไขข้อมูลการจองคิว"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการยืนยันการแก้ไขข้อมูลการจองคิวหรือไม่?</p>
      </Modal>
    </div>
  );
}
