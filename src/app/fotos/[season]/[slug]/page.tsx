import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlbum } from "@/lib/albums";
import { getCloudinaryFolder, type CloudinaryPhoto } from "@/lib/cloudinary";
import { Gallery } from "./Lightbox";
import styles from "./gallery.module.css";

type Props = { params: Promise<{ season: string; slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> { const {season,slug}=await params; const album=await getAlbum(season,slug).catch(() => null); if(!album) return {title:"Àlbum no trobat"}; return { title: album.seo_title ?? `${album.name} — Fotos | Thirsty Costa Brava`, description: album.seo_description ?? `Fotos de ${album.name} de Thirsty Costa Brava.`, alternates:{canonical:`/fotos/${season}/${slug}`}, openGraph: album.cover_public_id ? {images:[{url:`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${album.cover_public_id}`,alt:`Portada de ${album.name}`}]} : undefined }; }
export default async function AlbumPage({params}:Props){ const {season,slug}=await params; const album=await getAlbum(season,slug).catch(() => null); if(!album) notFound(); let photos: CloudinaryPhoto[]=[]; try{photos=await getCloudinaryFolder(album.cloudinary_folder);}catch{photos=[];} return <main className={styles.page}><header className={styles.header}><Link className={styles.back} href="/" aria-label="Tornar al home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg><span>Home</span></Link><h1>{album.name}</h1><span aria-hidden="true" /></header>{photos.length ? <Gallery photos={photos} albumName={album.name}/> : <p className={styles.empty}>Aquest àlbum encara no té fotos.</p>}</main>; }
