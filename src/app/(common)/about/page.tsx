import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Image from "next/image";
import about_image from '../../../../public/aboutus.jpg'
import Link from "next/link";

export default function AboutUs() {
  return (
    <>
      <MainHeader />
      <main>
        <section className="max-w-6xl mx-auto px-4 py-24 relative">
          <div className="lg:grid grid-cols-5 gap-5">
            <div className="col-span-3">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">
                About Us
              </h1>
              <div className="text-gray-700 text-base space-y-3">
                <p>
                  <strong className="text-xl text-secondary ">Bachat <span className="text-primary">Jar</span></strong> is India&apos;s rising cashback and savings platform, designed to help users earn up to <strong>100% cashback</strong> on their favorite online purchases. With a fast-growing user base, Bachat Jar is simplifying online savings for shoppers across the country.
                </p>

                <p>
                  Founded in <strong>2025</strong>, Bachat Jar was built on one simple mission — make every online transaction more rewarding. Whether you&apos;re shopping for clothes, gadgets, groceries, or booking your next trip, you deserve more in return.
                </p>

                <p>
                  Our partnerships with top Indian e-commerce platforms like Flipkart, Amazon, Myntra, and Ajio allow us to bring you verified cashback offers, exclusive promo codes, and the best deals — all in one place.
                </p>

                <p>
                  With a secure tracking system and a transparent dashboard, we make it easy for you to track your orders and cashback earnings. Withdraw your cashback anytime via bank transfer, UPI, or digital wallets.
                </p>

                <p>
                  Founder behind Bachat Jar, started the platform with the goal of transforming the way Indians save. With a background in e-commerce and a passion for innovation, he created Bachat Jar to ensure shoppers are always rewarded.
                </p>

                <p>
                  Join us early on this journey and experience a smarter, more rewarding way to shop online. Thank you for choosing Bachat Jar.
                </p>
              </div>

            
            </div>
            <div className="col-span-2 pt-10 lg:pt-20">
              <Image src={about_image} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="About image" height={300} width={100} className='w-full h-auto' />
            </div>
          </div>
            <Link
                href="/contact-us"
                className="inline-block mt-10 bg-primary text-white px-6 py-2 rounded shadow-md border border-primary transition hover:shadow-xl hover:ml-1 text-base font-medium"
              >
                Contact Us
              </Link>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
