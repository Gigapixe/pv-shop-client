import CopyrightFooter from "./CopyrightFooter";
import FooterLinks from "./FooterLinks";
import Newsletter from "./Newsletter";
import PaymentMethods from "./PaymentMethods";
import SocialLinks from "./SocialLinks";
import TrustPilot from "./TrustPilot";

export default function Footer() {
  return (
    <footer className="bg-primary/10 dark:bg-primary-dark/10">
      <Newsletter />
      <FooterLinks />
      <PaymentMethods />
      <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>
      <div className="flex items-center justify-between gap-4 container mx-auto pb-6 flex-wrap ">
        <SocialLinks />
        <TrustPilot />
      </div>
      <CopyrightFooter />
    </footer>
  );
}
