import HeroSlider from '@/components/pages/home/HeroSlider'
import PackagesSection from '@/components/pages/home/PackagesSection';
import StatsStrip from '@/components/pages/home/StatsStrip'
import React from 'react'

const Home = () => {

  return (
    <div>
      <HeroSlider />
      <StatsStrip />
      <PackagesSection />
    </div>
  )
}

export default Home