
import { JSX } from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactPage(): JSX.Element {
  return (
    <>
      <div className="bg-white dark:bg-background-dark">
        <div className="container mx-auto py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-48 items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
