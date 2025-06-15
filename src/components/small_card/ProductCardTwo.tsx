import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface CardProp {
  card_data: ICampaign;
}

const ProductCardTwo: React.FC<CardProp> = ({ card_data }) => {
  const [remainingTime, setRemainingTime] = useState<string>("00:00:00");

  useEffect(() => {
    if (!card_data?.flash_sale?.length || !card_data.flash_sale[0].end_time) return;

    const expireTime = new Date(card_data.flash_sale[0].end_time);
    if (isNaN(expireTime.getTime())) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = expireTime.getTime() - now;

      if (distance <= 0) {
        clearInterval(countdownInterval);
        setRemainingTime("EXPIRED");
      } else {
        const totalHours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setRemainingTime(
          `${String(totalHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [card_data?.flash_sale]);

  // console.log(card_data)

  return (
    <Link
      href={
        card_data.slug_type === "INTERNAL"
          ? `/campaign/${card_data?.product_slug}`
          : card_data?.store?.store_link
      }
      className="shadow max-h-[230px] mx-2 block overflow-hidden rounded-lg relative duration-200 border-[1px] cursor-pointer border-transparent hover:border-pink-300"
    >
      {/* Flash Sale Banner */}
      <div
        style={{
          borderBottomRightRadius: "30px",
          backgroundImage: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
        }}
        className="absolute top-1 left-1 text-[12px] md:text-[14px] font-normal text-white py-0.5 px-2 rounded-md shadow flex justify-center items-center gap-2 pr-3"
      >
        <span >Limited time offer</span> |{" "}
        <span>{remainingTime === "EXPIRED" ? "Expired" : remainingTime}</span>
      </div>
      <Image
        src={card_data?.flash_sale?.[0]?.image || "/fallback.jpg"}
        className="w-full h-[180px] "
        height={220}
        sizes="100vw"
        width={400}
        alt={card_data?.title || "Product Image"}
      />
    </Link>
  );
};

export default ProductCardTwo;
