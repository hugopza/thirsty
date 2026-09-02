import { ExperienceCollages } from "@/components/ExperienceCollages";
import { GroupFinder } from "@/components/GroupFinder";
import { HeroVideo } from "@/components/HeroVideo";
import { SocialLinks } from "@/components/SocialLinks";
import Image from "next/image";

export default function ThirstyExperiencesPage() {
  return (
    <>
      <header className="hero">
        <div className="topbar" aria-label="Capçalera">
          <div className="partner-lockup" aria-label="Thirsty en col·laboració amb Neway">
            <Image
              className="brand-logo brand-logo--header brand-logo--experiences-header"
              src="/media/thirsty-experiences-logo-v2.png"
              alt="Thirsty Experiences"
              width={680}
              height={219}
              priority
              unoptimized
            />
            <span className="partner-lockup__cross" aria-hidden="true">×</span>
            <Image
              className="partner-lockup__neway"
              src="/media/neway-logo-blanc.png"
              alt="Neway"
              width={1126}
              height={146}
              priority
            />
          </div>
        </div>
        <HeroVideo />
        <div className="hero__shade" />
        <div className="hero__copy">
          <h1>El viatge de final de curs comença aquí.</h1>
          <a className="hero__cta" href="#troba-el-teu-grup">
            TROBAR EL MEU GRUP
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </header>

      <main>
        <ExperienceCollages />
        <section className="menorca-title" aria-labelledby="menorca-title">
          <h2 id="menorca-title">Menorca</h2>
        </section>
        <GroupFinder />
      </main>

      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand-row">
            <div className="footer__brand-lockup" aria-label="Thirsty i Neway">
              <Image
                className="brand-logo brand-logo--footer brand-logo--experiences-footer"
                src="/media/thirsty-experiences-logo-v2.png"
                alt="Thirsty Experiences"
                width={680}
                height={219}
                unoptimized
              />
              <span aria-hidden="true">×</span>
              <Image
                className="footer__neway"
                src="/media/neway-logo-blanc.png"
                alt="Neway"
                width={1126}
                height={146}
              />
            </div>
            <h2 className="footer__title">
              See you
              <br />
              in Menorca.
            </h2>
          </div>

          <div className="footer__meta-row">
            <div className="footer__description">
              <p>Experiències de final de curs.</p>
            </div>
            <SocialLinks />
          </div>
        </div>

      </footer>
    </>
  );
}
