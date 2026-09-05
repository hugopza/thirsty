import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/types";

function serverSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  return createClient<Database>(url, key);
}

export type Album = Database["public"]["Tables"]["albums"]["Row"];

export async function getAlbums(): Promise<Album[]> {
  const { data, error } = await serverSupabase()
    .from("albums")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw new Error(`Unable to load albums: ${error.message}`);
  return data ?? [];
}

export async function getAlbum(season: string, slug: string): Promise<Album | null> {
  const { data, error } = await serverSupabase()
    .from("albums")
    .select("*")
    .eq("season", season)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Unable to load album: ${error.message}`);
  return data;
}
