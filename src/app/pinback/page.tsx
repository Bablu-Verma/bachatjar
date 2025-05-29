/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Suspense, useEffect } from "react";
import { generateSignature } from "@/helpers/server/uuidv4";
import { pinback_report_add_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";

function PinbackInner() {
  const searchParams = useSearchParams();

  const savepinbackdata = async (paramsObject: { [k: string]: string }) => {
    try {
      await axios.post(
        pinback_report_add_api,
        { raw_data: paramsObject },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams.entries());
    const click_id = paramsObject.click_id;
    if (click_id) {
      const parts = click_id.split("-");
      const extractedSignature = parts.pop();
      const originalData = parts.join("-");
      const generatedSignature = generateSignature(originalData);

      if (generatedSignature === extractedSignature) {
        // console.log("✅ Valid signature:");
        savepinbackdata(paramsObject);
      } else {
        // console.log("❌ Invalid signature:", extractedSignature);
      }
    }
  }, [searchParams]);

  return null;
}

export default function Pinback() {
  return (
    <Suspense>
      <PinbackInner />
    </Suspense>
  );
}
