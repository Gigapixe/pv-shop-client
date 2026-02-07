import SectionLabel from "@/components/ui/SectionLabel";
import BoltIcon from "@/public/icons/BoltIcon";
import ClockCheckIcon from "@/public/icons/ClockCheckIcon";
import ShieldCheckIcon from "@/public/icons/ShieldCheckIcon";


const FEATURES = [
  {
    title: "Safety",
    description: "Secure accounts crafted to today’s standards",
    icon: ShieldCheckIcon,
  },
  {
    title: "Longevity",
    description: "Use accounts for the long run without hassle",
    icon: ClockCheckIcon,
  },
  {
    title: "Speed",
    description: "Rapid fulfillment so you hit the ground running",
    icon: BoltIcon,
  },
];

export default function FeaturesHighlights() {
  return (
    <section className="w-full py-14 sm:py-20 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
         <SectionLabel>Features Highlights</SectionLabel>

          <h2 className="mt-2 text-3xl sm:text-5xl font-bold text-text-dark dark:text-background">
            Built for Your Success
          </h2>

          <p className="mt-3 text-sm sm:text-base max-w-xl mx-auto text-gray-600 dark:text-background/70">
            We don’t just sell accounts — we provide a toolset designed to
            empower your social & digital goals. Here’s what sets us apart.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item) => (
            <div
              key={item.title}
              className="
                rounded-2xl p-6
                bg-[#FFF5F0] dark:bg-[#282828]
                transition hover:shadow-md
              "
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full">
                <item.icon className="w-7 h-7 text-primary" fill="none"/>
              </div>

              <h3 className="mt-4 text-3xl font-semibold text-text-dark dark:text-background">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600 dark:text-background/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
