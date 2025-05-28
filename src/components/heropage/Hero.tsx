import React from 'react'
import Banner from './Banner'
import { ICampaign } from '@/model/CampaignModel';
import { IStore } from '@/model/StoreModel';
import HeroStore from './HeroStore';


interface HeroProps {
  home_store: IStore[];
  banner:ICampaign[]
}
const Hero: React.FC<HeroProps> = ({home_store, banner}) => {
  return (
    <section className="pt-2 lg:pt-10">
      <div className="max-w-6xl mx-auto lg:px-4 gap-2 grid grid-cols-5">
        <HeroStore store={home_store}/>
        <Banner banner={banner}/>
      </div>
    </section>
  )
}

export default Hero