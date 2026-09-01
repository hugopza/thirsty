import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { LazyLoopVideo } from "@/components/LazyLoopVideo";
import { SocialLinks } from "@/components/SocialLinks";
import { siteUrl } from "@/lib/site";
import styles from "./home.module.css";

const instagramUrl = "https://www.instagram.com/thirsty.cb/";
const socialImage = `${siteUrl}/media/thirsty-costa-brava-og.webp`;

export const metadata: Metadata = {
  title: { absolute: "Thirsty Costa Brava | Festes i experiències" },
  description:
    "Descobreix les festes de Thirsty Costa Brava, els últims moments i Thirsty Experiences, el viatge de final de curs a Menorca.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "ca_ES",
    url: siteUrl,
    siteName: "Thirsty",
    title: "Thirsty Costa Brava — Festes i experiències",
    description: "Festes, records reals i experiències amb la teva gent a la Costa Brava i Menorca.",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Ambient d'una festa Thirsty a la Costa Brava" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thirsty Costa Brava | Festes i experiències",
    description: "Festes, records reals i Thirsty Experiences.",
    images: [socialImage],
  },
};

const events = [
  { name: "Premiere", image: "/media/festa-thirsty-premiere.webp", alt: "Dues amigues a la festa Premiere de Thirsty", position: "center 38%" },
  { name: "Barbie", image: "/media/festa-thirsty-barbie.webp", alt: "Pista plena durant la festa Barbie de Thirsty", position: "center" },
];

const archives = [
  {
    title: "Premiere",
    images: [
      ["/media/festa-thirsty-premiere.webp", "Amigues a la festa Premiere de Thirsty"],
      ["/media/amics-thirsty-jacuzzi.webp", "Amics celebrant una nit Thirsty"],
      ["/media/ambient-nocturn-thirsty.webp", "Ambient nocturn en una festa Thirsty"],
    ],
  },
  {
    title: "Barbie",
    images: [
      ["/media/festa-thirsty-barbie.webp", "Públic de la festa Barbie de Thirsty"],
      ["/media/amigues-festa-thirsty.webp", "Dues amigues gaudint de Thirsty"],
      ["/media/aniversari-thirsty.webp", "Celebració d'aniversari a Thirsty"],
    ],
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {diagonal ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <HeroVideo
          className={styles.heroVideo}
          poster="/media/thirsty-home-hero-poster.webp"
          sources={[{ src: "/media/thirsty-home-hero-mobile.mp4", type: "video/mp4" }]}
          soundOnInteraction={false}
        />
        <div className={styles.heroShade} />
        <nav className={styles.topbar} aria-label="Navegació principal">
          <Link href="/" aria-label="Thirsty, inici">
            <Image className={styles.logo} src="/media/thirsty-logo-transparent.webp" alt="Thirsty" width={800} height={312} priority />
          </Link>
        </nav>
        <div className={styles.heroCopy}>
          <h1>This is<br />Thirsty.</h1>
        </div>
      </header>

      <main>
        <section className={styles.experiencesDoor} aria-labelledby="experiences-title">
          <Link className={styles.experiencesCard} href="/experiences">
            <LazyLoopVideo
              className={styles.experiencesVideo}
              poster="/media/thirsty-aftermovie-menorca-poster.webp"
              src="/media/thirsty-aftermovie-menorca-horizontal.mp4"
            />
            <div className={styles.experiencesShade} />
            <div className={styles.experiencesCopy}>
              <h2 id="experiences-title">Thirsty<br />Experiences.</h2>
              <div className={styles.experiencesLink}>
                <span>Menorca, la teva gent i una setmana per recordar</span>
                <Arrow />
              </div>
            </div>
          </Link>
        </section>

        <section className={styles.lightSection} aria-labelledby="dates-title">
          <div className={styles.sectionHead}>
            <h2 id="dates-title">Pròximes<br />dates.</h2>
          
          </div>
          <div className={styles.eventTrack}>
            {events.map((event) => (
              <article className={styles.event} key={event.name}>
                <Image src={event.image} alt={event.alt} fill sizes="(min-width: 800px) 31vw, 82vw" style={{ objectPosition: event.position }} />
                <div className={styles.eventShade} />
                <div className={styles.eventCopy}>
                  <small>Properament</small>
                  <h3>{event.name}</h3>
                  <div className={styles.eventMeta}>
                    <span>BeOut</span>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer">Entrades <Arrow diagonal /></a>
                  </div>
                </div>
              </article>
            ))}
            <article className={styles.soon}>
              <small>Coming soon</small>
              <strong>La següent<br />pel·lícula.</strong>
              <small>No spoilers.</small>
            </article>
          </div>
        </section>

        <section className={`${styles.lightSection} ${styles.stay}`} aria-labelledby="stay-title">
          <div className={styles.sectionHead}>
            <h2 id="stay-title">Stay<br />Thirsty.</h2>
          </div>
          <SocialLinks variant="list" />
        </section>

        <section className={styles.archives} aria-labelledby="archives-title">
          <div className={styles.sectionHead}>
            <h2 id="archives-title">Thirsty<br />Archives.</h2>
          </div>
          <div className={styles.albumTrack}>
            {archives.map((album) => (
              <a
                className={styles.album}
                href={instagramUrl}
                key={album.title}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Veure l'àlbum ${album.title} a Instagram`}
              >
                <div className={styles.albumCollage}>
                  {album.images.map(([src, alt]) => (
                    <div className={styles.shot} key={src}>
                      <Image src={src} alt={alt} fill sizes="(min-width: 800px) 21vw, 60vw" />
                    </div>
                  ))}
                </div>
                <h3>
                  {album.title}
                  <Arrow diagonal />
                </h3>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand-row">
            <div className="footer__brand-lockup">
              <Image
                className="brand-logo brand-logo--footer"
                src="/media/thirsty-logo-transparent.webp"
                alt="Thirsty"
                width={800}
                height={312}
              />
            </div>
            <h2 className="footer__title">See you<br />out there.</h2>
          </div>
          <div className="footer__meta-row">
            <div className="footer__description">
              <p>Festes i experiències.</p>
            </div>
            <SocialLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
