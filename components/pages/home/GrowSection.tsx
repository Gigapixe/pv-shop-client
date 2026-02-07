import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import CheckIcon from "@/public/icons/CheckIcon";
import Button from "@/components/ui/Button";

const GrowSection = () => {
    return (
        <section
            className="w-full py-14 sm:py-20 bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: "url(/assets/footerbg.png)" }}
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left content */}
                    <div className="max-w-2xl">
                        <SectionLabel className="text-left flex justify-start">WHY CHOOSE US</SectionLabel>

                        <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-text-dark dark:text-background leading-tight">
                            Grow Smarter with 100% <br className="hidden sm:block" />
                            Genuine PVA Accounts
                        </h2>

                        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-background/70 leading-relaxed">
                            At PVASHOP, we provide high-quality verified accounts designed for
                            business growth and digital marketing success. Choose platform-specific
                            or bulk accounts that match your goals.
                        </p>

                        <ul className="mt-6 space-y-3">
                            {[
                                "Variety of platform-specific PVA accounts",
                                "Bulk options for large-scale promotions",
                                "Safe & secure to use for marketing campaigns",
                                "24/7 dedicated support for instant help",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#12B47E]/10">
                                        <CheckIcon className="h-4 w-4" />
                                    </span>
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-background/80">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                       <div className="pt-6">
                         <Button variant="custom" className="bg-primary/10 hover:bg-primary/15 duration-300 border border-primary py-3 px-4 rounded-full text-primary" arrowIcon>
                            Learn More
                        </Button>
                       </div>
                    </div>

                    {/* Right image */}
                    <div className="relative">
                        <div className="relative w-full overflow-hidden rounded-3xl shadow-lg">
                            <Image
                                src="/assets/grow-section.jpg"
                                alt="Grow smarter"
                                width={1200}
                                height={800}
                                className="h-full w-full object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GrowSection;
