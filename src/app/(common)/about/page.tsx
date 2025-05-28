import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Image from "next/image";

import Link from "next/link";

export default function AboutUs() {
  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto px-4 my-24 relative">
          <div className="grid grid-cols-2 gap-20 w-full mb-10 items-center">
            <div>
              <h1 className="text-3xl font-semibold mb-6 text-gray-800">
                Our Story
              </h1>
              <div>
                <p className="text-sm font-normal mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non risus. Suspendisse lectus tortor, dignissim sit amet,
                  adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
                  diam. Sed sit amet lectus quis est congue tempus.
                </p>
                <p className="text-sm font-normal mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non risus. Suspendisse lectus tortor, dignissim sit amet,
                  adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
                  diam. Sed sit amet lectus quis est congue tempus.
                </p>
                <p className="text-sm font-normal mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non risus. Suspendisse lectus tortor, dignissim sit amet,
                  adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
                  diam. Sed sit amet lectus quis est congue tempus.
                </p>{" "}
                <p className="text-sm font-normal mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  non risus. Suspendisse lectus tortor, dignissim sit amet,
                  adipiscing nec, ultricies sed, dolor. Cras elementum ultrices
                  diam. Sed sit amet lectus quis est congue tempus.
                </p>
              </div>
              <Link
                href="/contact-us"
                className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[150px] text-center border-[1px] mt-16 hover:ml-1 border-primary rounded shadow-sm hover:shadow-2xl inline-block"
              >
                Contact Us
              </Link>
            </div>
            <div>
              <Image
                src="https://i.imgur.com/1I4TPe5.jpeg"
                alt="About Us"
                height={500}
                width={500}
                className="w-full max-w-[500px]"
                unoptimized
              />
            </div>
          </div>
       
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
