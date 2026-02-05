
import BottomHeader from "@/components/shared/header/BottomHeader";
import Header from "@/components/shared/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Digital Goods At Unbeatable Price Instantly - Trusted & Secure",
  description: "Trusted & Secure",
};

export default async function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <Header />
        <BottomHeader/>
        <main>{children}</main>
        {/* <Footer /> */}
        {/* <MobileFooter /> */}
      </div>
    </>
  );
}
