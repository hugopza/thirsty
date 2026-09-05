import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Fotos de festes Thirsty Costa Brava", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";

export default function PhotosPage() { redirect("/"); }
