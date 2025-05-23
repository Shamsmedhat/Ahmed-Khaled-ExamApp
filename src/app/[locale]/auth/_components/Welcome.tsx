import Image from "next/image";
import React from "react";
import loginImage from "@/assets/imgs/background-simple.png";
import { useTranslations } from "next-intl";

export default function Welcome() {
  const t = useTranslations();
  return (
    <section className="bg-second flex justify-center col-span-2  gap-4 p-4 rounded-r-[100px] ">
      <div className="w-4/5   flex flex-col gap-24 p-14  ">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold">{t("welcome")}</h1>
          <h1 className="text-5xl text-main font-bold">Elevate</h1>
          <div className=" ">
            <p className=" text-lg ">{t("lorem")}</p>
          </div>
        </div>

        <div className="w-[410px]">
          <Image
            src={loginImage}
            width={500}
            height={0}
            className="w-full object-contain "
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
