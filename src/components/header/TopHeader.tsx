
import React from 'react'

const TopHeader = () => {
  return (
    <section className="bg-dark py-2 px-4 mobile:hidden sm:block">
    <div
      className="max-w-6xl m-auto flex justify-between capitalize items-center"
    >
      <p className="text-white w-full text-center text-sm font-normal tracking-wider">
  This festival, save your money with BachatJar!
      <span className="ml-2">Follow us on</span>
      <a className="ml-1 text-sm text-white hover:text-primary " href="https://www.facebook.com/profile.php?id=61579048503561" target="_blank">Facebook</a>
      <span className="mx-1">|</span>
      <a className="text-sm text-white hover:text-primary " href="https://www.instagram.com/thebachatjar/" target="_blank">Instagram</a>
    </p>
      
    </div>
  </section>
  )
}

export default TopHeader