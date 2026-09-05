import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAlbums } from "@/lib/albums";
import { getCloudinaryFolder, cloudinaryUrl } from "@/lib/cloudinary";
import styles from "./albums.module.css";

export const metadata: Metadata = {
  title: "Fotos de festes Thirsty Costa Brava",
  description: "Àlbums de fotos de les festes i experiències Thirsty Costa Brava.",
  alternates: { canonical: "/fotos" },
};
export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  let albums = [] as Awaited<ReturnType<typeof getAlbums>>;
  try { albums = await getAlbums(); } catch { albums = []; }
  const cards = await Promise.all(albums.map(async (album) => ({ album, photos: await getCloudinaryFolder(album.cloudinary_folder).catch(() => []) })));
  return <main className={styles.page}><header className={styles.header}><h1>Fotos<br />Thirsty.</h1><Link className={styles.back} href="/">Tornar</Link></header><div className={styles.grid}>{cards.map(({ album, photos }) => { const cover = album.cover_public_id ? cloudinaryUrl(album.cover_public_id, undefined, "f_auto,q_auto,w_900") : photos[0] ? cloudinaryUrl(photos[0].public_id, photos[0].format, "f_auto,q_auto,w_900") : null; return <Link className={styles.album} href={`/fotos/${album.season}/${album.slug}`} key={album.id}><div className={styles.cover}>{cover ? <Image src={cover} alt={`Portada de ${album.name}, Thirsty Costa Brava`} fill sizes="(min-width: 768px) 33vw, 50vw" /> : null}</div><h2>{album.name}</h2><time className={styles.date} dateTime={album.date}>{new Intl.DateTimeFormat("ca-ES", { day:"numeric", month:"long", year:"numeric" }).format(new Date(`${album.date}T12:00:00`))}</time></Link>; })}</div>{albums.length===0 && <p className={styles.empty}>Encara no hi ha àlbums disponibles.</p>}</main>;
}
