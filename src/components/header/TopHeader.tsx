import Link from 'next/link'
import React from 'react'

const TopHeader = () => {
  return (
    <section className="bg-black py-2 px-4 mobile:hidden sm:block">
    <div
      className="max-w-6xl m-auto flex justify-between capitalize items-center"
    >
      <p className="text-white w-full text-center text-sm">
        Summer Sale for all swim suits and free delivery - off 50%!
        <Link
          href="#"
          className="ml-3 underline text-sm text-white hover:text-primary font-medium"
          >Click Now</Link>
      </p>
      
    </div>
  </section>
  )
}

export default TopHeader