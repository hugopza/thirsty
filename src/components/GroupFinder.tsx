"use client";

import { useEffect, useRef, useState } from "react";
import { isValidWhatsappUrl, selectBestGroup, type GroupRow } from "@/lib/groups";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CustomGroupSheet } from "./CustomGroupSheet";
import { SearchableSelect } from "./SearchableSelect";

type Option = { id: number; name: string };
type Result = { kind: "hidden" | "loading" } | { kind: "available"; url: string } | { kind: "pending"; message: string };
const noGroup = "Encara no hi ha un grup disponible per a aquesta selecció.";
const groupError = "Ara mateix no podem obrir aquest grup. Torna-ho a provar en uns instants.";

export function GroupFinder() {
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [comarques, setComarques] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);
  const [institutes, setInstitutes] = useState<Option[]>([]);
  const [provinceId, setProvinceId] = useState("");
  const [comarcaId, setComarcaId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [loading, setLoading] = useState({ provinces: true, comarques: false, locations: false, institutes: false });
  const [result, setResult] = useState<Result>({ kind: "hidden" });
  const requestId = useRef(0);
  const secondaryVideoRef = useRef<HTMLVideoElement>(null);
  const [loadSecondaryVideo, setLoadSecondaryVideo] = useState(false);
  const [sheet, setSheet] = useState<{ open: boolean; island: "menorca" | "" }>({ open: false, island: "menorca" });

  useEffect(() => {
    let current = true;
    void createSupabaseBrowserClient().from("provinces").select("id,name").order("name").then(({ data }) => {
      if (!current) return;
      setProvinces(data ?? []); setLoading((state) => ({ ...state, provinces: false }));
    });
    return () => { current = false; };
  }, []);

  useEffect(() => {
    const video = secondaryVideoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoadSecondaryVideo(true); if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) void video.play().catch(() => undefined); } else video.pause();
    }, { rootMargin: "800px 0px" });
    observer.observe(video); return () => observer.disconnect();
  }, []);
  useEffect(() => { if (!loadSecondaryVideo) return; const video = secondaryVideoRef.current; if (!video) return; video.load(); void video.play().catch(() => undefined); }, [loadSecondaryVideo]);

  function applyGroup(rows: GroupRow[] | null, selection: { locationId?: number; instituteId?: number }, final: boolean) {
    if (rows === null) { if (final) setResult({ kind: "pending", message: groupError }); return; }
    const group = selectBestGroup(rows, selection);
    if (group && isValidWhatsappUrl(group.whatsapp_url)) setResult({ kind: "available", url: group.whatsapp_url });
    else if (group) setResult({ kind: "pending", message: "Estem preparant aquest grup. Estarà disponible en breus." });
    else if (final) setResult({ kind: "pending", message: noGroup });
    else setResult({ kind: "hidden" });
  }
  async function groupsFor(comarca: number) {
    const { data, error } = await createSupabaseBrowserClient().from("whatsapp_groups").select("location_id,institute_id,whatsapp_url").eq("comarca_id", comarca);
    return error ? null : data ?? [];
  }
  async function changeProvince(value: string) {
    const id = ++requestId.current; setProvinceId(value); setComarcaId(""); setLocationId(""); setInstituteId(""); setComarques([]); setLocations([]); setInstitutes([]); setResult({ kind: "hidden" }); if (!value) return;
    setLoading((s) => ({ ...s, comarques: true })); const { data } = await createSupabaseBrowserClient().from("comarques").select("id,name").eq("province_id", Number(value)).order("name");
    if (id === requestId.current) { setComarques(data ?? []); setLoading((s) => ({ ...s, comarques: false })); }
  }
  async function changeComarca(value: string) {
    const id = ++requestId.current; setComarcaId(value); setLocationId(""); setInstituteId(""); setLocations([]); setInstitutes([]); setResult({ kind: "hidden" }); if (!value) return;
    setLoading((s) => ({ ...s, locations: true })); const [locationResponse, groups] = await Promise.all([createSupabaseBrowserClient().from("locations").select("id,name").eq("comarca_id", Number(value)).order("name"), groupsFor(Number(value))]);
    if (id !== requestId.current) return; const next = locationResponse.data ?? []; setLocations(next); setLoading((s) => ({ ...s, locations: false })); applyGroup(groups, {}, next.length === 0);
  }
  async function changeLocation(value: string) {
    const id = ++requestId.current; setLocationId(value); setInstituteId(""); setInstitutes([]); setResult({ kind: "hidden" }); if (!value || !comarcaId) return;
    setLoading((s) => ({ ...s, institutes: true })); const [instituteResponse, groups] = await Promise.all([createSupabaseBrowserClient().from("institutes").select("id,name").eq("location_id", Number(value)).order("name"), groupsFor(Number(comarcaId))]);
    if (id !== requestId.current) return; const next = instituteResponse.data ?? []; setInstitutes(next); setLoading((s) => ({ ...s, institutes: false })); applyGroup(groups, { locationId: Number(value) }, next.length === 0);
  }
  async function changeInstitute(value: string) {
    const id = ++requestId.current; setInstituteId(value); if (!value || !comarcaId) { setResult({ kind: "hidden" }); return; } setResult({ kind: "loading" }); const groups = await groupsFor(Number(comarcaId)); if (id === requestId.current) applyGroup(groups, { locationId: Number(locationId), instituteId: Number(value) }, true);
  }

  return <><section className="finder-section" id="troba-el-teu-grup" aria-labelledby="finder-title"><div className="finder-copy"><h2 id="finder-title">Troba el teu grup de WhatsApp</h2><p>Selecciona d’on vens i el teu institut per trobar el grup del vostre viatge de final de curs a Menorca.</p></div><div className="finder">
    <div className="finder__field"><SearchableSelect id="province" label="Província" value={provinceId} options={provinces} loading={loading.provinces} placeholder="Cerca una província" onChange={(value) => void changeProvince(value)} /></div>
    <div className="finder__field"><SearchableSelect key={`comarca-${provinceId}`} id="comarca" label="Comarca" value={comarcaId} options={comarques} loading={loading.comarques} disabled={!provinceId || loading.comarques} placeholder="Cerca una comarca" onChange={(value) => void changeComarca(value)} /></div>
    {(loading.locations || locations.length > 0) && <div className="finder__field"><SearchableSelect key={`location-${comarcaId}`} id="location" label="Població" value={locationId} options={locations} loading={loading.locations} disabled={!comarcaId || loading.locations} placeholder="Cerca una població" onChange={(value) => void changeLocation(value)} /></div>}
    {(loading.institutes || institutes.length > 0) && <div className="finder__field"><SearchableSelect key={`institute-${locationId}`} id="institute" label="Institut" value={instituteId} options={institutes} loading={loading.institutes} disabled={!locationId || loading.institutes} placeholder="Cerca un institut" onChange={(value) => void changeInstitute(value)} /></div>}
    {result.kind === "available" ? <a className="button button--finder button--whatsapp" href={result.url} target="_blank" rel="noopener noreferrer">ENTRAR AL GRUP</a> : <button className="button button--finder" type="button" disabled>ENTRAR AL GRUP</button>}{result.kind === "pending" && <p className="finder__result finder__result--pending" role="status">{result.message}</p>}
  </div><div className="finder-secondary"><div className="finder-secondary__video"><video ref={secondaryVideoRef} autoPlay muted loop playsInline preload="none" poster="/media/thirsty-aftermovie-menorca-poster.webp" aria-label="Experiència de viatge de final de curs a Menorca">{loadSecondaryVideo && <source src="/media/thirsty-aftermovie-menorca-horizontal.mp4" type="video/mp4" />}</video></div><button className="finder-secondary__primary" type="button" onClick={() => setSheet({ open: true, island: "menorca" })}>Necessites un grup personalitzat?<span className="finder-secondary__primary-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M9 7h8v8" /></svg></span></button><button className="finder-secondary__islands" type="button" onClick={() => setSheet({ open: true, island: "" })}>Vols anar a Mallorca o Eivissa?</button></div></section><CustomGroupSheet open={sheet.open} initialIsland={sheet.island} onClose={() => setSheet((current) => ({ ...current, open: false }))} /></>;
}
