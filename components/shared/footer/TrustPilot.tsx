import Image from "next/image";
import pci from "../../../public/assets/pci.png";
import { FaStar } from "react-icons/fa";

const TrustPilot = () => {
  return (
    <div>
      {" "}
      <div className="flex items-center gap-4 flex-wrap">
        <Image src={pci} height={178} width={86} alt="pci icon"></Image>
        <a
          href="https://uk.trustpilot.com/review/gamingty.com"
          target="_blank"
          rel="noopener"
          className="flex items-center border p-3 rounded-lg border-primary hover:bg-primary/10 transition-all"
        >
          <span className="mr-2 text-sm md:text-lg text-content-default dark:text-white">
            Review us on
          </span>
          <FaStar
            size={24}
            className="text-primary"
          />
          <span className="text-primary text-sm md:text-lg ml-1">
            Trustpilot
          </span>
        </a>
      </div>
    </div>
  );
};

export default TrustPilot;
