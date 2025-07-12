'use client'

import React from 'react'
import Banner from './Banner'
import DealOfTheDay from './DealOfTheDay';
import { ICampaignWithStore } from '@/common_type';



interface HeroProps {
  deals: ICampaignWithStore[];
  banner: ICampaignWithStore[]
}
const Hero: React.FC<HeroProps> = ({deals, banner}) => {
  return (
    <section className="pt-2 lg:pt-6">
      <div className="max-w-6xl mx-auto lg:px-4 gap-1 grid grid-cols-6">
        <DealOfTheDay deals={deals}/>
        <Banner banner={banner}/>
      </div>
    </section>
  )
}

export default Hero