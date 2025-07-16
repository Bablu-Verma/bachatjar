import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import NotFoundC from "@/components/NotFoundC";

export default function NotFound() {
  return (
    <>

      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16">
          <div className="min-h-[68vh] justify-center items-center flex ">
           <NotFoundC title='Offer' />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
