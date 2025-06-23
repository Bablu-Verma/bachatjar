import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import ContactForm from "./_contact_form";
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Contact Us - Get Support | BachatJar',
  description: 'Get in touch with BachatJar support team. We\'re available 24/7 to help you with cashback, shopping queries, and technical support.',
  keywords: 'contact BachatJar, customer support, help, customer service, support email, contact form',
  openGraph: {
    title: 'Contact BachatJar Support',
    description: 'Need help? Contact our 24/7 support team for assistance with your cashback and shopping queries.',
    url: 'https://bachatjar.com/contact-us',
    siteName: 'BachatJar',
    images: [
      {
        url: 'https://bachatjar.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact BachatJar Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact BachatJar Support',
    description: 'Get help from our 24/7 support team.',
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
    canonical: 'https://bachatjar.com/contact-us',
  },
};

export default function ContactUs() {
  // Create organization contact schema
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BachatJar",
    "url": "https://bachatjar.com",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91 857657567",
        "contactType": "customer service",
        "email": "customer@help.com",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    }
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
        "name": "Contact Us",
        "item": "https://bachatjar.com/contact-us"
      }
    ]
  };

  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto px-4 my-24  relative">
          <h1 className="text-3xl font-semibold text-center text-gray-800">Contact Us</h1>
          <div className="md:grid grid-cols-4 gap-14 w-full mt-16">
            <div className="col-span-1 pb-5 md:pb-0 md:pr-6">
              <div className="mb-6 border-b-2 pb-2">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                  <i className="fa-solid fa-phone text-primary mr-3"></i> Call to Us
                </h2>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  We are availbable 24/7,7 days a week.
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">Phone: +91 {process.env.NEXT_PUBLIC_NUMBER}</p>
              </div>
              <div className="mb-6 border-b-2 pb-2">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                <i className="fa-solid fa-envelope text-primary mr-3"></i> Wright to us
                </h2>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Find out our form and we will connact you within 24 hours.
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Email: help@bachatjar.com
                </p>
             
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                 <i className="fa-solid fa-location-pin text-primary mr-3"></i> Address
                </h2>
                <address className="text-sm text-gray-500 ml-3 mb-2">
                 KH No-374, Maujpur New Delhi <br />
                 India-110093
                </address>
              
              </div>
            </div>
           <ContactForm />
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
