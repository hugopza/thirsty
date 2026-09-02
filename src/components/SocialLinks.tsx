type SocialLink = {
  href: string | undefined;
  label: string;
  icon: "instagram" | "tiktok" | "whatsapp";
};

const socialLinks: SocialLink[] = [
  {
    href:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/thirsty.cb/",
    label: "Instagram",
    icon: "instagram",
  },
  {
    href:
      process.env.NEXT_PUBLIC_TIKTOK_URL ??
      "https://www.tiktok.com/@thirsty.cb?_r=1&_t=ZG-99Jf5zHSj8j",
    label: "TikTok",
    icon: "tiktok",
  },
  {
    href:
      process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ??
      "https://chat.whatsapp.com/Iz82uQG3zEtCjMajvD69ZJ",
    label: "Comunitat de WhatsApp",
    icon: "whatsapp",
  },
];

function SocialIcon({ icon }: Pick<SocialLink, "icon">) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle className="social-links__dot" cx="17.4" cy="6.7" r="1" />
      </svg>
    );
  }

  if (icon === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.2 3v11.1a4.6 4.6 0 1 1-3.4-4.44v3.02a1.83 1.83 0 1 0 .6 1.42V3h2.8Zm0 0c.42 2.45 1.85 3.91 4.3 4.4v2.82a7.64 7.64 0 0 1-4.3-1.78" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 11.7a8.3 8.3 0 0 1-12.26 7.3L4 20.1l1.1-4.02A8.3 8.3 0 1 1 20.4 11.7Z" />
      <path d="M9.1 7.75c.18-.42.37-.43.55-.44h.47c.14 0 .34.05.44.34l.7 1.7c.08.2.04.37-.08.54l-.42.53c-.14.16-.28.31-.12.58.56.95 1.3 1.72 2.28 2.27.25.14.4.13.58-.08l.77-.9c.18-.21.38-.24.62-.14l1.63.77c.25.12.42.18.47.29.05.1.05.62-.13 1.18-.18.56-1.07 1.07-1.48 1.13-.42.05-.94.08-1.52-.1-.35-.12-.8-.27-1.37-.52-2.4-1.05-3.97-3.5-4.1-3.67-.12-.16-.98-1.3-.98-2.48 0-1.18.62-1.76.84-2Z" />
    </svg>
  );
}

export function SocialLinks({ variant = "icons" }: { variant?: "icons" | "list" }) {
  const availableLinks = socialLinks.filter(
    (link): link is SocialLink & { href: string } => Boolean(link.href),
  );

  if (availableLinks.length === 0) return null;

  return (
    <nav
      className={variant === "list" ? "social-links social-links--list" : "social-links"}
      aria-label="Xarxes socials de Thirsty"
    >
      {availableLinks.map((link) => (
        <a
          href={link.href}
          key={link.icon}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
        >
          {variant === "list" ? (
            <>
              <span>{link.label}</span>
              <svg className="social-links__arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </>
          ) : (
            <SocialIcon icon={link.icon} />
          )}
        </a>
      ))}
    </nav>
  );
}
