import {
  FaDiscord,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaReddit,
  FaSnapchat,
  FaStar,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaMedium,
  FaPinterest,
  FaQuora,
} from "react-icons/fa";

import { useTranslations } from "next-intl";

type SocialItem = {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
};

const socialIcons: SocialItem[] = [
  {
    id: 1,
    name: "Facebook",
    icon: FaFacebook,
    link: "https://www.facebook.com/gamingty2k22",
  },
  {
    id: 2,
    name: "Instagram",
    icon: FaInstagram,
    link: "https://www.instagram.com/gamingty2025",
  },
  {
    id: 3,
    name: "X (Twitter)",
    icon: FaTwitter,
    link: "https://x.com/Gamingty2025",
  },
  {
    id: 4,
    name: "TikTok",
    icon: FaTiktok,
    link: "https://www.tiktok.com/@gamingty2k26",
  },
  {
    id: 5,
    name: "Medium",
    icon: FaMedium,
    link: "https://medium.com/@gamingty2025",
  },
  {
    id: 6,
    name: "Pinterest",
    icon: FaPinterest,
    link: "https://www.pinterest.com/gamingty2025",
  },
  {
    id: 7,
    name: "Quora",
    icon: FaQuora,
    link: "https://www.quora.com/profile/Gamingty",
  },
  {
    id: 8,
    name: "LinkedIn",
    icon: FaLinkedin,
    link: "https://www.linkedin.com/in/gaming2025",
  },
  {
    id: 9,
    name: "Discord",
    icon: FaDiscord,
    link: "https://discord.gg/gamingty",
  },
  {
    id: 10,
    name: "Reddit",
    icon: FaReddit,
    link: "https://www.reddit.com/user/gamingty2025/",
  },
  {
    id: 11,
    name: "WhatsApp",
    icon: FaWhatsapp,
    link: "https://wa.me/971568346414",
  },
  {
    id: 12,
    name: "Telegram",
    icon: FaTelegram,
    link: "https://t.me/fleximart",
  },
];

const SocialLinks = () => {
  const t = useTranslations();

  return (
    <div>
      <h1 className="mb-4">{t("footer.followUs")}</h1>

      <div className="flex flex-wrap gap-4 items-center">
        {socialIcons.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="transition-transform hover:scale-110 text-primary"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
