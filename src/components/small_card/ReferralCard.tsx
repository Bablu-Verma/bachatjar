'use client'
import { IReferral } from "@/model/ReferralModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";


const ReferralCard: React.FC<{ item: IReferral }> = ({ item }) => {
    return (
        <div className="rounded-3xl shadow p-3 bg-white">
            <Image width={200} height={100} src={item.imageUrl || ''} alt={item.title} className="w-full h-32 object-cover rounded rounded-t-2xl" />
            <div className="pt-3">
                <h3 className="text-[#16171a] font-normal text-sm capitalize line-clamp-3">{item.title}</h3>
                <div className="flex justify-between items-center pt-2">
                    <strong className="text-primary text-lg sm:text-xl sm:mr-3 ">₹{item.rewardForUser}/- </strong>
                    <Link
                        href={`/referral-link/${item.slug}`}
                        className="select-none rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-center font-semibold py-1 px-3 text-[12px] sm:text-sm shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        Get Offer
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReferralCard;
