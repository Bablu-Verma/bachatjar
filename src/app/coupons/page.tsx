import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { getServerToken } from "@/helpers/server/server_function";
import { coupons_list_api } from "@/utils/api_url";
import { RiCoupon3Fill } from "react-icons/ri";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import CouponClient from "./Coupon_Client";

 const GetData = async (token: string) => {
  try {
    const { data } = await axios.post(
      coupons_list_api,
      {
       
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error registering user", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export default async function Category() {

  const token = await getServerToken()
  const page_data = await GetData(token)


  return (
    <>

      <MainHeader />
      <main>
        <div className="max-w-6xl  px-2 m-auto mt-4 lg:mt-8 mb-16">
          <div className="flex justify-center items-center h-[130px] sm:h-[200px]">
            <h1 className="text-3xl md:text-5xl uppercase text-secondary flex gap-3 font-medium">Best <span className="text-primary ">Coupons </span> <RiCoupon3Fill className="text-primary" /></h1>
          </div>
        <CouponClient coupons={page_data} />
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
