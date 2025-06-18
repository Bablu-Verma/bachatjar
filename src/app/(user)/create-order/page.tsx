"use client";


import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { create_order_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import MainHeader from "@/components/header/MainHeader";
import Footer from "@/components/Footer";
import { RotatingLines } from "react-loader-spinner";



const CreateUserOrder = () => {

  const searchParams = useSearchParams();
  const token = useSelector((state: RootState) => state.user.token);

  const store_id = searchParams.get("store_id");


  useEffect(() => {
    if (!store_id) {
      toast.error("Missing parameters.");
      return;
    }

    const shop_now = async () => {
      try {
        const { data } = await axios.post(
          create_order_api,
          { store_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (data.success && typeof data.url === "string") {
          setTimeout(() => {
            window.location.href = data.url;
          }, 3000);
        } else {
          console.error("Invalid URL");
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

    shop_now();
  }, [store_id, token]); 



  return (
    <>
      <MainHeader />
      <main className="max-w-6xl  mx-auto relative flex justify-center items-center  min-h-screen ">

        <div className="flex justify-center items-center gap-5 flex-col">
          <RotatingLines
            visible={true}
            strokeWidth="5"
            width="70"
            strokeColor="#CC2B52"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />

          <p className='text-secondary text-lg'><strong>Create Your Order</strong>, Please wait.</p>
        </div>

      </main>
      <Footer />
    </>
  );
}


export default CreateUserOrder