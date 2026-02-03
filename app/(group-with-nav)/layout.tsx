
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
        {/* <Header /> */}
        <main>{children}</main>
        {/* <Footer /> */}
        {/* <MobileFooter /> */}
      </div>
    </>
  );
}
