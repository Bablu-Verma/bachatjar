import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { MainHeading } from "@/components/Heading";
import Featured from "@/components/heropage/Featured";
import Hero from "@/components/heropage/Hero";
import BestSalling from "@/components/homepage/BestSelling";
import CallApiInHome from "@/components/homepage/CallApiInHome";
import Deals from "@/components/homepage/Deals";
import HomeBlog from "@/components/homepage/HomeBlog";
import HomeCategories from "@/components/homepage/HomeCategories";
import HomeFlash from "@/components/homepage/HomeFlash";
import HomePoster from "@/components/homepage/HomePoster";
import HowToWork from "@/components/HowToWork";
import Loginhomepopup from "@/components/Loginhomepopup";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import StoreCard from "@/components/small_card/StoreCard";
import { getServerToken } from "@/helpers/server/server_function";
import { ICoupon } from "@/model/CouponModel";
import { IStore } from "@/model/StoreModel";
import { home_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";

const GetData = async (token: string) => {
  try {
    const data = await axios.post(home_api, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error home data  fatching", error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export default async function Home() {
  const token = await getServerToken();
  const page_data = await GetData(token);

  if (!page_data) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <MainHeader />
      <CallApiInHome />

      <Hero
        home_store={page_data?.data.store}
        banner={page_data?.data.main_banner}
      />

      <main>
        <Loginhomepopup />

        {page_data?.data.flash_sale &&
          page_data?.data.flash_sale.length > 0 && (
            <div className="py-7">
              <MainHeading title="Limited Time Offer" link={null} />
              <HomeFlash flashSale={page_data?.data.flash_sale} />
            </div>
          )}

        {page_data?.data.best_product.length > 0 && (
          <div className="py-7">
            <MainHeading title="Best For You" link={null} />
            <BestSalling best_product={page_data?.data.best_product} />
          </div>
        )}

        {!token && <HowToWork />}

        <div>
          <Deals best_product={page_data?.data} />
        </div>

        {page_data?.data.long_poster.length > 0 && (
          <div className="max-w-6xl mx-auto mt-14">
            <HomePoster poster={page_data?.data.long_poster} />
          </div>
        )}

        <div className="max-w-6xl m-auto bg-gradient-to-b from-[#f1f5f8] to-[#dfe8ef] py-3 px-2 rounded-xl mt-4 lg:mt-14">
          <MainHeading title="Cashback store" link="/store" />
          <div className="max-w-6xl relative  m-auto  mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-5 mt-3 lg:mt-5">
              {page_data?.data.store.map((item: IStore, i: number) => (
                <StoreCard item={item} key={i} />
              ))}
            </div>
          </div>
        </div>

        {page_data?.data.premium_product.length > 0 && (
          <div className="py-7">
            <MainHeading title="New Arrival" link={null} />
            <Featured arrival={page_data?.data.premium_product} />
          </div>
        )}

        <div className="py-7">
          <MainHeading title="New Coupon" link="/coupons" />
          <div className="max-w-6xl relative px-2 m-auto mt-2 lg:mt-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 mt-2 lg:mt-6">
              {page_data?.data.coupon.map((item: ICoupon, i: number) => (
                <CouponcodeCard item={item} key={i} />
              ))}
            </div>
          </div>
        </div>

        {page_data?.data.category.length > 0 && (
          <div className="max-w-6xl m-auto py-3 lg:px-2 lg:rounded-xl relative bg-[#f5c4d0]">
            <MainHeading title="Browse by category" link={null} />
            <HomeCategories category={page_data?.data.category} />
          </div>
        )}

        {page_data?.data.blog.length > 0 && (
          <div className="py-7">
            <MainHeading title="Read Our Blog" link="/blog" />
            <HomeBlog blogs={page_data?.data.blog} />
          </div>
        )}
        <BottomToTop />
      </main>

      <Footer />
    </>
  );
}
