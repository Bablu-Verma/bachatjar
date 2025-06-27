import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IStore } from "@/model/StoreModel";

interface istorecard {
  item: IStore;
}
const StoreCard: React.FC<istorecard> = ({ item }) => {
  return (
    <Link
      href={`/store/${item.slug}`}
      className="bg-white rounded-md px-3 pb-2 justify-center gap-1 flex flex-col items-center border-[1px] border-gray-200 pt-10 relative hover:shadow-orange-300"
    >
      <p className="text-[12px] min-w-[50%] text-center text-light bg-primary rounded-b-xl px-3 py-[1px] absolute top-0 ">
        {item.cashback_type == "FLAT_AMOUNT" && <>₹{item.cashback_rate}.00</>}
        {item.cashback_type == "PERCENTAGE" && <>{item.cashback_rate}%</>} Off
      </p>
      <Image
        src={item.store_img}
        alt={item.name}
        width={100}
        height={70}
        className="rounded-md mb-3 h-auto"
      />

      <div className="text-sm sm:text-base capitalize text text-blue-500">
        {item.name}
      </div>

      <div className="text-[12px] sm:text-sm w-full items-center justify-center flex rounded-md mt-2 text-primary gap-[2px] capitalize py-1 px-2 bg-[#F5C4D0]">
        {" "}
        <span>Upto</span>
        <span>
          {item.cashback_type == "FLAT_AMOUNT" && (
            <>₹{item.cashback_rate}.00</>
          )}
          {item.cashback_type == "PERCENTAGE" && <>{item.cashback_rate}%</>}{" "}
        </span>
         <span className="sm:hidden">CB</span>
        <span className="hidden sm:block">Cashback</span>
      </div>
    </Link>
  );
};

StoreCard.propTypes = {};

export default StoreCard;
