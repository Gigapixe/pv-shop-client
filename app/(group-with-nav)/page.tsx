import FaqList from '@/components/pages/faq/FaqList';
import FeaturesHighlights from '@/components/pages/home/FeaturesHighlights';
import GrowSection from '@/components/pages/home/GrowSection';
import HeroSlider from '@/components/pages/home/HeroSlider'
import PackageCard from '@/components/pages/home/PackageCard';
import StatsStrip from '@/components/pages/home/StatsStrip'
import TestimonialsSlider from '@/components/pages/home/TestimonialsSlider';
import SectionLabel from '@/components/ui/SectionLabel';
import { CartItemType } from '@/zustand/store';



const packagesData = [
  {
    _id: "youtube-pva",
    title: "Youtube PVA",
    slug: "youtube-pva",
    price: 55,
    image: "/assets/package/youtube.png",
    type: "DIGITAL_PINS" as CartItemType,
    features: ["100 PVA accounts", "Fast delivery with replacement policy", "Satisfaction guaranteed"],
  },
  {
    _id: "yahoo-pva",
    title: "Yahoo PVA",
    slug: "yahoo-pva",
    price: 35,
    image: "/assets/package/yahoo.png",
    type: "DIGITAL_PINS" as CartItemType,
    features: ["100 Email PVA accounts", "Fast delivery with replacement policy", "Satisfaction guaranteed"],
  },
  {
    _id: "google-pva",
    title: "Google PVA",
    slug: "google-pva",
    price: 35,
    image: "/assets/package/yahoo.png",
    type: "DIGITAL_PINS" as CartItemType,
    features: ["100 Email PVA accounts", "Fast delivery with replacement policy", "Satisfaction guaranteed"],
  },
];
const Home = () => {

  return (
    <div>
      <HeroSlider />
      <StatsStrip />
      <section className="w-full py-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <SectionLabel>Our Packages</SectionLabel>
            <h1 className="mt-2 text-2xl sm:text-5xl font-bold text-text-dark dark:text-background">
              Full Spectrum of PVA Services
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-background/60">
              Choose the best option for your needs. Fast delivery and quality guarantee.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packagesData.map((p) => (
              <PackageCard key={p._id} {...p} />
            ))}
          </div>
        </div>
      </section>

      <GrowSection />
      <FeaturesHighlights />
      <TestimonialsSlider/>
      <FaqList/>
    </div>
  )
}

export default Home

