
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Faq_client from "./faq_client";

const faq_question = [
  {
    question: "What is the best discount offer?",
    answer: "The best discount offer is 15%.",
    id: 1,
  },
  {
    question: "What is the refund policy?",
    answer: "You can request a refund within 30 days of purchase.",
    id: 2,
  },
  {
    question: "How do I track my order?",
    answer: "You can track your order using the tracking number provided in the confirmation email.",
    id: 3,
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription anytime from your account settings.",
    id: 4,
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide.",
    id: 5,
  },
];



export default function FAQ() {
  return (
    <>
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
