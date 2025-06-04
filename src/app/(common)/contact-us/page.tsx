import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import ContactForm from "./_contact_form";

export default function ContactUs() {
  return (
    <>
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
                <p className="text-sm text-gray-500 ml-3 mb-2">Phone: +91 857657567</p>
              </div>
              <div className="mb-6 border-b-2 pb-2">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                <i className="fa-solid fa-envelope text-primary mr-3"></i> Wright to us
                </h2>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Find out our form and we will connact you within 24 hours.
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Email: customer@help.com
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Email: discount@help.com
                </p>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                 <i className="fa-solid fa-location-pin text-primary mr-3"></i> Address
                </h2>
                <address className="text-sm text-gray-500 ml-3 mb-2">
                  Street: 123 Main St, New York, NY 10001
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
