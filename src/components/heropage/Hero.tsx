'use client'

import React from 'react'
import Banner from './Banner'
import { ICampaign } from '@/model/CampaignModel';

import DealOfTheDay from './DealOfTheDay';



interface HeroProps {
  deals: ICampaign[];
  banner: ICampaign[]
}
const Hero: React.FC<HeroProps> = ({deals, banner}) => {
  return (
    <section className="pt-2 lg:pt-6">
      <div className="max-w-6xl mx-auto lg:px-4 gap-2 grid grid-cols-5">
        <DealOfTheDay deals={deals}/>
        <Banner banner={banner}/>
      </div>
    </section>
  )
}

export default Hero