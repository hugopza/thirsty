import Image from "next/image";
import { publicAsset } from "@/lib/site";

const slides = [
  {
    layout: "collage--one",
    images: [
      ["/media/viatge-final-curs-menorca-cala.webp", "Cala d'aigua turquesa a Menorca"],
      ["/media/amics-viatge-menorca-v2.webp", "Grup d'amigues durant el viatge a Menorca"],
      ["/media/festa-thirsty-amics.webp", "Amigues en una festa Thirsty"],
    ],
  },
  {
    layout: "collage--two",
    images: [
      ["/media/salt-cala-menorca.webp", "Estudiants saltant a una cala de Menorca"],
      ["/media/grup-amigues-menorca.webp", "Amigues gaudint de Menorca"],
      ["/media/ambient-nocturn-thirsty.webp", "Ambient nocturn en una festa Thirsty"],
    ],
  },
  {
    layout: "collage--three",
    images: [
      ["/media/experiencia-menorca-penya-segat.webp", "Experiència amb amics a la costa de Menorca"],
      ["/media/bany-menorca-estudiants.webp", "Bany amb amics a Menorca"],
      ["/media/festa-thirsty-menorca.webp", "Records d'una nit de festa Thirsty"],
    ],
  },
  {
    layout: "collage--four",
    images: [
      ["/media/grup-menorca-capvespre.webp", "Grup d'amics al capvespre a Menorca"],
      ["/media/activitat-menorca-estudiants.webp", "Activitat de dia per a estudiants a Menorca"],
      ["/media/amics-menorca-capvespre.webp", "Amics de viatge a Menorca"],
    ],
  },
] as const;

export function ExperienceCollages() {
  return (
    <section className="collages" aria-label="Records de l'experiència a Menorca">
      <div className="collages__track">
        {slides.map((slide, slideIndex) => (
          <div className={`collage ${slide.layout}`} key={slide.layout}>
            {slide.images.map(([src, alt], imageIndex) => (
              <div className="collage__image" key={src}>
                <Image
                  src={publicAsset(src)}
                  alt={alt}
                  fill
                  sizes="(max-width: 767px) 86vw, 38vw"
                  loading={slideIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
