import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Faq_client from "./faq_client";
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | BachatJar',
  description: 'Find answers to common questions about BachatJar cashback, how to earn and withdraw money, tracking orders, and more.',
  keywords: 'BachatJar FAQ, cashback questions, how to earn cashback, withdrawal process, online shopping help',
  openGraph: {
    title: 'BachatJar FAQ - Get Help with Cashback & Shopping',
    description: 'Find answers to your questions about earning and withdrawing cashback, shopping through BachatJar, and more.',
    url: 'https://bachatjar.com/faq',
    siteName: 'BachatJar',
    images: [
      {
        url: '/faq-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BachatJar FAQ',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BachatJar FAQ - Cashback Help & Support',
    description: 'Get answers to frequently asked questions about BachatJar cashback and shopping.',
    images: ['/faq-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://bachatjar.com/faq',
  },
};

const faq_question = [
  {
    id: 1,
    question: "What is Bachat Jar?",
    answer: "Bachat Jar is India’s cashback and savings platform that lets you earn cashback on online purchases from partnered stores.",
  },
  {
    id: 2,
    question: "How do I earn cashback on Bachat Jar?",
    answer: "Simply log in, select a store from our list, click through Bachat Jar to shop, and your cashback will be tracked automatically after purchase confirmation.",
  },
  {
    id: 3,
    question: "How long does it take for cashback to be credited?",
    answer: "Typically, cashback is credited after the retailer confirms the purchase and the return/refund period ends, which can take up to 60 days.",
  },
{
  id: 4,
  question: "Can I combine cashback with promo codes?",
  answer: "Currently, cashback cannot be combined with promo codes on the retailer’s site. We’ll update you if this changes.",
},
  {
    id: 5,
    question: "Is there a minimum purchase amount to get cashback?",
    answer: "Minimum purchase amounts vary depending on the retailer and the offer. Please check the specific deal details on Bachat Jar.",
  },
  {
    id: 6,
    question: "How do I withdraw my cashback earnings?",
    answer: "Once your cashback balance reaches ₹100, you can request a withdrawal via UPI, bank transfer, or digital wallets. Processing may take up to 20 business days.",
  },
  {
    id: 7,
    question: "What if my cashback is not tracking?",
    answer: "Make sure you clicked the store link from Bachat Jar before shopping. If cashback is missing, contact our support team with your order details.",
  },
  {
    id: 8,
    question: "Do I need to create an account to use Bachat Jar?",
    answer: "Yes, creating an account helps us track your purchases and credit your cashback securely.",
  },
  {
    id: 9,
    question: "Is Bachat Jar safe and secure to use?",
    answer: "Yes, we prioritize your privacy and security, using encrypted tracking and not sharing your data without consent.",
  },
  {
    id: 10,
    question: "Can I earn cashback on mobile app purchases?",
    answer: "Currently, cashback is primarily available for desktop and mobile web purchases via referral links. Some apps may not be supported.",
  },
  {
    id: 11,
    question: "How do I know if my order is confirmed?",
    answer: "You can check your cashback status in your Bachat Jar dashboard — statuses include Pending, Confirmed, or Paid.",
  },
  {
    id: 12,
    question: "Can I use Bachat Jar with multiple devices?",
    answer: "Yes, your account and cashback tracking are tied to your login, so you can shop and earn cashback on any device.",
  },
  {
    id: 13,
    question: "What retailers does Bachat Jar partner with?",
    answer: "We partner with major Indian e-commerce stores including Amazon, Flipkart, Myntra, Ajio, and many more.",
  },
  {
    id: 14,
    question: "Can I share my cashback earnings with others?",
    answer: "No, cashback earnings are linked to your account and cannot be transferred or shared.",
  },
  {
    id: 15,
    question: "What happens if I return a product?",
    answer: "Cashback will be revoked if the product is returned or refunded as per the retailer's return policy.",
  },
  {
    id: 16,
    question: "How can I contact Bachat Jar support?",
    answer: "You can reach out to our support team via the Contact Us page or email at support@bachatjar.com.",
  },
  {
    id: 17,
    question: "Are there any fees to use Bachat Jar?",
    answer: "No, Bachat Jar is completely free for users to earn cashback.",
  },
  {
    id: 18,
    question: "Can I use Bachat Jar internationally?",
    answer: "Currently, Bachat Jar services and cashback offers are available only for users shopping from India.",
  },
  {
    id: 19,
    question: "How often are new offers added?",
    answer: "We update our deals and cashback offers regularly to provide the latest and best savings opportunities.",
  },
  {
    id: 20,
    question: "What should I do if I forgot my account password?",
    answer: "Use the 'Forgot Password' option on the login page to reset your password via your registered email.",
  },
];




export default function FAQ() {
  // Create FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq_question.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
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
        "name": "FAQ",
        "item": "https://bachatjar.com/faq"
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto px-4 my-24 relative">
          <h1 className="text-3xl font-bold text-gray-700 text-center">FAQ</h1>
          <div className="mt-10">
            <Faq_client faq_question={faq_question} />
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
