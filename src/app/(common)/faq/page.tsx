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
        url: 'https://bachatjar.com/og-image.png',
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
    canonical: 'https://bachatjar.com/faq',
  },
};

const faq_question = [
  {
    id: 1,
    question: "What is Bachat Jar?",
    answer:
      "Bachat Jar is an Indian cashback and savings platform that helps users earn money back while shopping online. It partners with popular e-commerce stores like Amazon, Flipkart, Myntra, and Ajio. When you visit these stores through Bachat Jar and make a purchase, the platform tracks your transaction and credits cashback once the purchase is confirmed. It also offers exclusive deals and discount coupons, making online shopping more economical for users.",
  },
  {
    id: 2,
    question: "How do I earn cashback on Bachat Jar?",
    answer:
      "To earn cashback, you must first log in to your Bachat Jar account. Browse the list of partner stores on the platform and click on the one you wish to shop from. This redirects you to the store’s official site. Make your purchase as usual. Once your transaction is tracked and confirmed (usually after the return period ends), the cashback will be credited to your Bachat Jar account.",
  },
  {
    id: 3,
    question: "How long does it take for cashback to be credited?",
    answer:
      "Cashback credit timelines depend on the retailer. Typically, after your purchase is confirmed and the return/refund period ends, it takes between 45 to 60 days for the cashback to be reflected in your Bachat Jar account. This is because retailers wait for the order to be finalized before releasing the commission that Bachat Jar shares with you as cashback.",
  },
  {
    id: 4,
    question: "Can I combine cashback with promo codes?",
    answer:
      "In most cases, cashback from Bachat Jar cannot be combined with additional promo codes or coupons used directly on the retailer’s site, unless specified otherwise. If promo codes are used outside of Bachat Jar's platform, it may disrupt the cashback tracking process, leading to a failed cashback claim.",
  },
  {
    id: 5,
    question: "Is there a minimum purchase amount to get cashback?",
    answer:
      "Yes, some retailers set a minimum cart value in order to be eligible for cashback. This requirement varies by store and offer. Always read the terms and conditions of a particular deal or cashback offer on Bachat Jar before making a purchase to ensure you meet the minimum spend criteria.",
  },
  {
    id: 6,
    question: "How do I withdraw my cashback earnings?",
    answer:
      "Once your confirmed cashback balance crosses ₹100, you are eligible to withdraw the amount. Withdrawals can be made via UPI, bank transfer, or supported digital wallets. You need to enter your payment details in the withdrawal section, and the request will be processed within 20 business days, depending on your chosen method.",
  },
  {
    id: 7,
    question: "What if my cashback is not tracking?",
    answer:
      "If your cashback isn’t tracked, ensure you started your shopping session by clicking through Bachat Jar. Avoid opening other tabs, using ad blockers, or applying third-party coupons. If tracking still fails, you can contact Bachat Jar's support team within 7 days of your transaction with the order ID and screenshot of your purchase confirmation.",
  },
  {
    id: 8,
    question: "Do I need to create an account to use Bachat Jar?",
    answer:
      "Yes, creating an account is mandatory. It allows Bachat Jar to track your transactions, manage your cashback earnings, and send you personalized deals and updates. Your account also serves as a wallet for your earnings and helps in processing withdrawals securely.",
  },
  {
    id: 9,
    question: "Is Bachat Jar safe and secure to use?",
    answer:
      "Absolutely. Bachat Jar uses secure, encrypted technologies to track purchases and protect user data. The platform never shares your personal information with third parties without your consent. It operates transparently and follows strict privacy guidelines.",
  },
  {
    id: 10,
    question: "Can I earn cashback on mobile app purchases?",
    answer:
      "Bachat Jar cashback works best when you shop via mobile or desktop browser after clicking through its links. Some retailer apps do not support affiliate tracking, which may lead to untracked cashback. To avoid issues, complete purchases on the mobile web or desktop site, not the app unless explicitly allowed.",
  },
  {
    id: 11,
    question: "How do I know if my order is confirmed?",
    answer: "After you make a purchase via Bachat Jar, the retailer sends a confirmation to Bachat Jar's tracking system. You can check your order status in your Bachat Jar dashboard under the 'Order History' section. Orders typically appear as 'Pending' shortly after the transaction and will move to 'Confirmed' once the retailer validates the purchase and the return/refund window is closed.",
  },
  {
    id: 12,
    question: "Can I use Bachat Jar on multiple devices?",
    answer: "Yes, you can access your Bachat Jar account across multiple devices including smartphones, tablets, and desktops. Just make sure you are logged in with the same account. Your cashback tracking remains consistent as long as you follow the correct shopping procedure from the platform.",
  },
  {
    id: 13,
    question: "What retailers does Bachat Jar partner with?",
    answer: "Bachat Jar partners with a wide range of top Indian e-commerce websites such as Amazon, Flipkart, Myntra, Ajio, Tata CLiQ, Nykaa, and more. The full list of partner retailers is available under the 'Stores' or 'All Brands' section of the app/website.",
  },
  {
    id: 14,
    question: "Can I share my cashback earnings with others?",
    answer: "No, cashback earnings are non-transferable. They are linked to your personal Bachat Jar account and can only be withdrawn by the account holder. Sharing access or trying to transfer earnings to others violates our terms of service.",
  },
  {
    id: 15,
    question: "What happens if I return a product?",
    answer: "If you return or cancel a product, the retailer marks the order as 'returned' or 'cancelled', and Bachat Jar does not receive any commission. Hence, any pending cashback related to that order is cancelled and will not be credited to your account.",
  },
  {
    id: 16,
    question: "How can I contact Bachat Jar support?",
    answer: "You can reach our support team via the 'Contact Us' section on the website. Alternatively, you can chat with us directly through our in-app chat system for instant help. Please include relevant details such as your order ID, the store you purchased from, and the purchase date to receive faster assistance.",
  },
  {
    id: 17,
    question: "Are there any fees to use Bachat Jar?",
    answer: "No, Bachat Jar is completely free to use. There are no hidden charges, subscription fees, or transaction costs associated with cashback earnings. You can register and start earning cashback without paying anything.",
  },
  {
    id: 18,
    question: "Can I use Bachat Jar internationally?",
    answer: "Currently, Bachat Jar only supports purchases made from within India and on Indian versions of the partnered e-commerce platforms. Cashback cannot be earned on international purchases or when accessing stores from outside India.",
  },
  {
    id: 19,
    question: "How often are new offers added?",
    answer: "New offers and deals are added regularly, often daily, to keep up with seasonal promotions, sales events, and retailer updates. You can visit the homepage or subscribe to our newsletter to stay informed about the latest deals.",
  },
  {
    id: 20,
    question: "What should I do if I forgot my account password?",
    answer: "Go to the login page and click on the 'Forgot Password' option. Enter your registered email ID, and a password reset link will be sent to your inbox. Follow the link to create a new password and regain access to your account.",
  },
  {
    id: 21,
    question: "Why is my cashback status 'Pending'?",
    answer: "Cashback is marked as 'Pending' until the partner store verifies that the transaction was successful and the product was not returned. This period allows for cancellations, returns, or modifications to the order. Once verified, your cashback will move to 'Confirmed' status.",
  },
  {
    id: 22,
    question: "What is the difference between pending and confirmed cashback?",
    answer: "'Pending' cashback is the amount tracked after your purchase but not yet finalized by the retailer. 'Confirmed' cashback is the amount that has been verified and is eligible for withdrawal. Confirmed cashback is typically credited after the return window ends.",
  },
  {
    id: 23,
    question: "Can I cancel a cashback withdrawal request?",
    answer: "Once a withdrawal request is submitted, it is processed automatically. If you need to cancel it, please contact customer support immediately. If the transfer has already begun, cancellation may not be possible.",
  },
  {
    id: 24,
    question: "Why was my cashback declined?",
    answer: "Cashback can be declined for several reasons, such as order cancellation, returned items, use of unapproved coupon codes, or if the purchase was not tracked properly. Always ensure you complete the transaction through Bachat Jar to avoid issues.",
  },
  {
    id: 25,
    question: "Can I refer friends to Bachat Jar?",
    answer: "Bachat Jar does not use a traditional referral system. Instead, we offer a 'Deal Share & Earn' program. You can share specific product deals or offers from our platform with your friends and followers using your unique sharing link. When someone makes a purchase using your shared link, you earn a portion of the cashback as a reward. This way, you benefit directly from the purchases influenced by your deal sharing. Terms and conditions apply to this earning model.",
  },
  {
    id: 26,
    question: "How can I change my payment method for withdrawals?",
    answer: "Go to the 'Profile' or 'Side Bar' section of the platform. Under 'Withdrawal Add', you can update your UPI ID, bank account number, or linked wallet. Ensure that your details are accurate to avoid failed transactions.",
  },
  {
    id: 27,
    question: "Do I get cashback on prepaid and COD (Cash on Delivery) orders?",
    answer: "Most partner retailers support cashback on both prepaid and cash-on-delivery orders. However, for COD orders, cashback confirmation may take longer, as it depends on final delivery and confirmation by the seller.",
  },
  {
    id: 28,
    question: "Can I use ad blockers while shopping through Bachat Jar?",
    answer: "No, using ad blockers or browser extensions can interfere with tracking cookies, which may prevent Bachat Jar from recording your transaction. Always disable ad blockers before clicking through to a retailer’s site.",
  },
  {
    id: 29,
    question: "Does Bachat Jar offer a mobile app?",
    answer: "Bachat Jar does not currently offer a dedicated mobile app. However, our platform is fully optimized as a user-friendly web app that works seamlessly across all mobile browsers. You can access all features—such as browsing deals, tracking cashback, and requesting withdrawals—directly through your phone’s browser, just like you would on a native app.",
  },
  {
    id: 30,
    question: "Can I use multiple coupons from outside Bachat Jar?",
    answer: "Using third-party coupon codes not listed on Bachat Jar may void your cashback eligibility. To ensure proper tracking and cashback rewards, always use only the coupons provided directly by Bachat Jar.",
  },
  {
    id: 31,
    question: "How will I be notified when cashback is credited?",
    answer: "You will receive a notification via email as well as within your Bachat Jar notification when your cashback status changes to 'Confirmed'. We do not offer push notifications, but our built-in on-site notification system ensures you are promptly updated when your cashback is processed or if any action is required from your end.",
  },
  {
    id: 32,
    question: "Can I shop in incognito or private mode?",
    answer: "No, do not use incognito/private browser windows while shopping via Bachat Jar. These modes may block the cookies required to track your transaction, which can result in untracked cashback.",
  },
  {
    id: 33,
    question: "Do I need to upload an invoice for cashback validation?",
    answer: "In most cases, you don’t need to upload anything. However, if your cashback does not track, our support team may ask for your invoice or order confirmation email to help resolve the issue and manually verify the purchase.",
  },
  {
    id: 34,
    question: "How do I update my personal details?",
    answer: "Log into your Bachat Jar account, go to the 'Profile' section, and click on 'Edit Profile'. From there, you can update your name, email, mobile number, or payment details securely.",
  },
  {
    id: 35,
    question: "Can businesses use Bachat Jar for purchases?",
    answer: "Bachat Jar is designed for individual users, but small businesses can use it for regular purchases. However, bulk orders or purchases made for resale may be disqualified from cashback depending on retailer policies.",
  },
  {
    id: 36,
    question: "Does cashback expire if not used?",
    answer: "Currently, there is no expiry date for confirmed cashback. However, we recommend withdrawing your earnings regularly to avoid potential policy changes in the future. Pending cashback that is declined or rejected will not be available.",
  },
  {
    id: 37,
    question: "Why is my cashback amount different from what was shown?",
    answer: "The final cashback amount depends on the net transaction value (excluding taxes, delivery, and gift wrapping). If any part of the order is cancelled or returned, cashback is adjusted accordingly. Some stores also apply rate changes without prior notice.",
  },
  {
    id: 38,
    question: "What should I do before placing an order?",
    answer: "Before shopping, ensure you are logged in to Bachat Jar, disable ad blockers, don’t visit other cashback/coupon sites, and complete your order in one session. This helps ensure accurate tracking and successful cashback.",
  },
  {
    id: 39,
    question: "Can I earn cashback on recharges or bill payments?",
    answer: "Yes, Bachat Jar offers cashback on select prepaid recharges, DTH payments, and utility bill payments through partner platforms. Check the offers section for available deals and categories.",
  },
  {
    id: 40,
    question: "Is the cashback I earn on Bachat Jar real cash?",
    answer: "Yes, the cashback you earn on Bachat Jar is real money. Once your cashback is confirmed (after the purchase is validated and the return/refund window ends), it is added to your Bachat Jar wallet. You can withdraw this amount to your bank account, UPI ID, or supported digital wallets. It is not virtual coins or points—it’s actual cash that you can use outside the platform for anything you like. Just make sure you meet the minimum withdrawal threshold and follow the withdrawal process as per the platform’s policy.",
  },
  {
  id: 41,
  question: "What happens if I forget to log in before shopping?",
  answer: "If you’re not logged in when clicking a deal or making a purchase, Bachat Jar won’t be able to track the order or credit cashback to your account. Always ensure you're logged in before shopping to avoid missing out on rewards.",
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
