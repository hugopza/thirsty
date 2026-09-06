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
      <svg viewBox="0 0 32 32" aria-hidden="true" className="social-links__instagram">
        <path d="M22.3 8.4c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4Z" />
        <path d="M16 10.2c-3.3 0-5.9 2.7-5.9 5.9s2.7 5.9 5.9 5.9 5.9-2.7 5.9-5.9-2.6-5.9-5.9-5.9Zm0 9.7c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8Z" />
        <path d="M20.8 4h-9.5C7.2 4 4 7.2 4 11.2v9.5c0 4 3.2 7.2 7.2 7.2h9.5c4 0 7.2-3.2 7.2-7.2v-9.5C28 7.2 24.8 4 20.8 4Zm4.9 16.8c0 2.7-2.2 5-5 5h-9.5c-2.8 0-5-2.2-5-5v-9.5c0-2.8 2.2-5 5-5h9.5c2.8 0 5 2.2 5 5v9.5Z" />
      </svg>
    );
  }

  if (icon === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-links__tiktok">
        <path d="M16.8218 5.1344C16.0887 4.29394 15.648 3.19805 15.648 2H14.7293C14.9659 3.3095 15.7454 4.43326 16.8218 5.1344Z" />
        <path d="M8.3218 11.9048C6.73038 11.9048 5.43591 13.2004 5.43591 14.7931C5.43591 15.903 6.06691 16.8688 6.98556 17.3517C6.64223 16.8781 6.43808 16.2977 6.43808 15.6661C6.43808 14.0734 7.73255 12.7778 9.324 12.7778C9.62093 12.7778 9.90856 12.8288 10.1777 12.9124V9.40192C9.89927 9.36473 9.61628 9.34149 9.324 9.34149C9.27294 9.34149 9.22654 9.34614 9.1755 9.34614V12.0394C8.90176 11.9558 8.61873 11.9048 8.3218 11.9048Z" />
        <path d="M19.4245 6.67608V9.34614C17.6429 9.34614 15.9912 8.77501 14.6456 7.80911V14.7977C14.6456 18.2851 11.8108 21.127 8.32172 21.127C6.97621 21.127 5.7235 20.6998 4.69812 19.98C5.8534 21.2198 7.50049 22 9.32392 22C12.8083 22 15.6478 19.1627 15.6478 15.6707V8.68211C16.9933 9.64801 18.645 10.2191 20.4267 10.2191V6.78293C20.0787 6.78293 19.7446 6.74574 19.4245 6.67608Z" />
        <path d="M14.6456 14.7977V7.80911C15.9912 8.77501 17.6429 9.34614 19.4245 9.34614V6.67608C18.3945 6.45788 17.4899 5.90063 16.8218 5.1344C15.7454 4.43326 14.9704 3.3095 14.7245 2H12.2098L12.2051 15.7775C12.1495 17.3192 10.8782 18.5591 9.32393 18.5591C8.35884 18.5591 7.50977 18.0808 6.98085 17.3564C6.06219 16.8688 5.4312 15.9076 5.4312 14.7977C5.4312 13.205 6.72567 11.9094 8.31708 11.9094C8.61402 11.9094 8.90168 11.9605 9.17079 12.0441V9.35079C5.75598 9.42509 3 12.2298 3 15.6707C3 17.3331 3.64492 18.847 4.69812 19.98C5.7235 20.6998 6.97621 21.127 8.32172 21.127C11.8061 21.127 14.6456 18.2851 14.6456 14.7977Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="social-links__whatsapp">
      <path d="M11.42 9.49c-.19-.09-1.1-.54-1.27-.61s-.29-.09-.42.1-.48.6-.59.73-.21.14-.4 0a5.13 5.13 0 0 1-1.49-.92 5.25 5.25 0 0 1-1-1.29c-.11-.18 0-.28.08-.38s.18-.21.28-.32a1.39 1.39 0 0 0 .18-.31.38.38 0 0 0 0-.33c0-.09-.42-1-.58-1.37s-.3-.32-.41-.32h-.4a.72.72 0 0 0-.5.23 2.1 2.1 0 0 0-.65 1.55A3.59 3.59 0 0 0 5 8.2 8.32 8.32 0 0 0 8.19 11c.44.19.78.3 1.05.39a2.53 2.53 0 0 0 1.17.07 1.93 1.93 0 0 0 1.26-.88 1.67 1.67 0 0 0 .11-.88c-.05-.07-.17-.12-.36-.21Z" />
      <path d="M13.29 2.68A7.36 7.36 0 0 0 8 .5a7.44 7.44 0 0 0-6.41 11.15l-1 3.85 3.94-1a7.4 7.4 0 0 0 3.55.9H8a7.44 7.44 0 0 0 5.29-12.72ZM8 14.12a6.12 6.12 0 0 1-3.15-.87l-.22-.13-2.34.61.62-2.28-.14-.23a6.18 6.18 0 0 1 9.6-7.65 6.12 6.12 0 0 1 1.81 4.37A6.19 6.19 0 0 1 8 14.12Z" />
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
