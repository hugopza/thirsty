import { ExperienceCollages } from "@/components/ExperienceCollages";
import { GroupFinder } from "@/components/GroupFinder";
import { HeroVideo } from "@/components/HeroVideo";
import Image from "next/image";

export default function ThirstyExperiencesPage() {
  return (
    <>
      <header className="hero">
        <div className="topbar" aria-label="Capçalera">
          <Image
            className="brand-logo brand-logo--header"
            src="/media/thirsty-logo-transparent.webp"
            alt="Thirsty"
            width={800}
            height={312}
            priority
          />
        </div>
        <HeroVideo />
        <div className="hero__shade" />
        <div className="hero__copy">
          <h1>El viatge de final de curs comença aquí.</h1>
          <a className="hero__cta" href="#troba-el-teu-grup">TROBAR EL MEU GRUP</a>
        </div>
      </header>

      <main>
        <ExperienceCollages />
        <GroupFinder />
      </main>

      <footer className="footer">
        <Image
          className="brand-logo brand-logo--footer"
          src="/media/thirsty-logo-transparent.webp"
          alt="Thirsty"
          width={800}
          height={312}
        />
        <p>Experiències de final de curs.</p>
      </footer>
    </>
  );
}
