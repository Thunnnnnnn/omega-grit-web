"use client";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const store = useAuthStore();

  const router = useRouter();

  const goToBooking = () => {
    if (store.user) {
      router.push("/booking");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-black p-10">
      <div
        className="lg:w-[35vw] lg:h-[55vh] w-[280px] h-[280px]"
        style={{ position: "relative" }}
      >
        <Image src="/logo.png" alt="Login image" fill />
      </div>
      <h1 className="lg:text-4xl font-bold my-4 text-center text-2xl">
        ยินดีต้อนรับสู่ Omega Grit Pet Care
      </h1>
      <p className="lg:text-lg mb-8 text-center text-sm">
        โซลูชันครบวงจรสำหรับการดูแลสัตว์เลี้ยงของคุณ
      </p>

      <Button type="primary" size="large" onClick={goToBooking}>
        จองคิวเลย
      </Button>
    </div>
  );
}
