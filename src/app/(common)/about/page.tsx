import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Image from "next/image";
import about_image from "../../../../public/aboutus.png";
import Link from "next/link";
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'About BachatJar - India\'s Leading Cashback Platform',
  description: 'Learn about BachatJar, India\'s growing cashback platform. Founded in 2025, we help users earn up to 100% cashback on online shopping from top e-commerce stores.',
  keywords: 'about BachatJar, cashback platform, online savings, Indian e-commerce, BachatJar story',
  openGraph: {
    title: 'About BachatJar - Your Trusted Cashback Partner',
    description: 'Discover how BachatJar is transforming online shopping in India with cashback rewards and exclusive deals.',
    url: 'https://bachatjar.com/about',
    siteName: 'BachatJar',
    images: [
      {
        url: 'https://bachatjar.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About BachatJar',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About BachatJar - India\'s Leading Cashback Platform',
    description: 'Learn how BachatJar helps Indians save more on online shopping.',
    images: ['https://bachatjar.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://bachatjar.com/about',
  },
};

export default function AboutUs() {
  // Create organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BachatJar",
    "url": "https://bachatjar.com",
    "logo": "https://bachatjar.com/logo.png",
    "foundingDate": "2025",
    "description": "India's rising cashback and savings platform, helping users earn up to 100% cashback on their favorite online purchases.",
    "sameAs": [
      "https://facebook.com/bachatjar",
      "https://twitter.com/bachatjar",
      "https://instagram.com/bachatjar",
      "https://linkedin.com/company/bachatjar"
    ]
  };

  // Create breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bachatjar.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://bachatjar.com/about"
      }
    ]
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main>
        <section className="max-w-6xl mx-auto px-4 py-24 relative">
          <div className="flex flex-col-reverse items-center sm:items-start lg:grid grid-cols-5 gap-5">
            <div className="col-span-3">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">
                About Us
              </h1>
              <div className="text-gray-700 text-base space-y-3">
                <p> At  <strong className="text-xl text-secondary ">
                  Bachat <span className="text-primary">Jar</span>
                </strong>, we are dedicated to providing high-quality products at affordable prices, helping you make the most out of every purchase. Founded by Mohit Kumar Gaur and Bablu Verma, Bachat Jar is a trusted name in the e-commerce space, committed to offering a wide range of products designed to meet the needs of our diverse customer base. Whether you&apos;re looking for everyday essentials or special items, our goal is to provide you with a seamless shopping experience that combines convenience, reliability, and value.</p>

                <p>Located in New Delhi, we have built our business on the principles of customer satisfaction and innovation. By carefully curating our product range, we ensure that you receive only the best- all while maintaining competitive prices. Our team, led by Mohit Gaur and Bablu Verma, works tirelessly to ensure that every product offered on Bachat Jar meets stringent quality standards.</p>

                <p>
                  Our office is located at:
                  <address>
                    Saumya Sales, Gali No. 3, KH No. 374, Mata Mandir, Majpur, New Delhi, DL 110093, India.
                  </address>
                </p>

                <p>At Bachat Jar, we understand the importance of convenience, which is why we make sure that all your orders are processed quickly and efficiently. Whether you are a first-time shopper or a loyal customer, we are here to make sure your experience with us is always positive. We strive to build long-term relationships with our customers based on trust and great service.</p>

                <h3 className="font-medium">Why Choose Bachat Jar?</h3>

                <ul className="list-disc pl-6">
                  <li>Wide Product Range: From everyday essentials to unique items, we have something for everyone.</li>
                  <li>Affordable Pricing: Get the best value for your money without compromising on quality.</li>
                  <li>Customer-Centric Approach: We prioritize customer satisfaction in every aspect of our business.</li>
                  <li>Shop with us today and experience the best in quality, price, and service!</li>
                </ul>
              </div>

            </div>
            <div className="col-span-2 pt-5 lg:pt-20">
              <Image
                src={about_image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="About "
                height={300}
                width={100}
                className="w-full h-auto max-w-[300px] sm:max-w-[500px]"
              />
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
