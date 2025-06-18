"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; 
import axios, { AxiosError } from "axios";
import { create_share_link_api } from "@/utils/api_url";

function CreateShareOrderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const store_id = searchParams.get("store_id");
    const user_id = searchParams.get("user_id");

    if (!store_id || !user_id) {
      toast.error("Missing parameters.");
      return;
    }

    const createOrder = async () => {
      try {
        const { data } = await axios.post(
          create_share_link_api,
          {
            store_id: store_id,
            user_id: user_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.success === true) {
          if (data?.url && typeof data.url === "string") {
             window.location.href = data.url
          } else {
            console.error("Invalid URL");
          }
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error registering user", error.response?.data.message);
          toast.error(error.response?.data.message);
        } else {
          console.error("Unknown error", error);
        }
      }
    };

    createOrder();
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {/* <p className="text-xl">Please wait, creating your order...</p> */}
    </div>
  );
}

export default function CreateShareOrder() {
  return (
    <Suspense>
      <CreateShareOrderInner />
    </Suspense>
  );
}
