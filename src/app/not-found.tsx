import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import Image from "next/image";
import Link from "next/link";
import error from '../../public/error.svg'

export default function NotFound() {
  return (
    <>

      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16">
          <div className="min-h-[68vh] justify-center items-center flex ">
            <div className="flex justify-center items-center flex-col">
              <Image height={350} width={350} src={error} alt="error" />
              <div className="h-5"></div>
              <Link className="text-primary text-base lg:text-lg hover:underline" href="/">
                Go to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
