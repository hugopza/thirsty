"use client";

import { useEffect, useRef, useState } from "react";
import { isValidWhatsappUrl, selectBestGroup } from "@/lib/groups";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CustomGroupSheet } from "./CustomGroupSheet";
import { SearchableSelect } from "./SearchableSelect";

type Option = { id: number; name: string };
type Result =
  | { kind: "hidden" }
  | { kind: "loading" }
  | { kind: "available"; url: string }
  | { kind: "pending"; message: string };

export function GroupFinder() {
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [counties, setCounties] = useState<Option[]>([]);
  const [institutes, setInstitutes] = useState<Option[]>([]);
  const [provinceId, setProvinceId] = useState("");
  const [countyId, setCountyId] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [loading, setLoading] = useState({ provinces: true, counties: false, institutes: false });
  const [result, setResult] = useState<Result>({ kind: "hidden" });
  const groupRequestId = useRef(0);
  const [sheet, setSheet] = useState<{ open: boolean; island: "menorca" | "" }>({
    open: false,
    island: "menorca",
  });

  useEffect(() => {
    let current = true;
    void createSupabaseBrowserClient()
      .from("comarques")
      .select("id,name")
      .order("name")
      .then(({ data }) => {
        if (!current) return;
        setProvinces(data ?? []);
        setLoading((state) => ({ ...state, provinces: false }));
      });
    return () => {
      current = false;
    };
  }, []);

  async function changeProvince(value: string) {
    groupRequestId.current += 1;
    setProvinceId(value);
    setCountyId("");
    setInstituteId("");
    setCounties([]);
    setInstitutes([]);
    setResult({ kind: "hidden" });
    if (!value) return;

    setLoading((state) => ({ ...state, counties: true }));
    const { data } = await createSupabaseBrowserClient()
      .from("locations")
      .select("id,name")
      .eq("comarca_id", Number(value))
      .order("name");
    setCounties(data ?? []);
    setLoading((state) => ({ ...state, counties: false }));
  }

  async function changeCounty(value: string) {
    groupRequestId.current += 1;
    setCountyId(value);
    setInstituteId("");
    setInstitutes([]);
    setResult({ kind: "hidden" });
    if (!value) return;

    setLoading((state) => ({ ...state, institutes: true }));
    const { data } = await createSupabaseBrowserClient()
      .from("institutes")
      .select("id,name")
      .eq("location_id", Number(value))
      .order("name");
    setInstitutes(data ?? []);
    setLoading((state) => ({ ...state, institutes: false }));
  }

  async function loadGroup(selectedInstituteId: string) {
    if (!countyId || !selectedInstituteId) {
      setResult({ kind: "hidden" });
      return;
    }

    const requestId = groupRequestId.current + 1;
    groupRequestId.current = requestId;
    setResult({ kind: "loading" });

    const instituteIdNumber = Number(selectedInstituteId);
    const { data, error } = await createSupabaseBrowserClient()
      .from("whatsapp_groups")
      .select("institute_id,whatsapp_url")
      .eq("location_id", Number(countyId))
      .or(`institute_id.eq.${instituteIdNumber},institute_id.is.null`);

    if (requestId !== groupRequestId.current) return;

    if (error) {
      setResult({
        kind: "pending",
        message: "Ara mateix no podem obrir aquest grup. Torna-ho a provar en uns instants.",
      });
      return;
    }

    const group = selectBestGroup(data ?? [], instituteIdNumber);
    if (group && isValidWhatsappUrl(group.whatsapp_url)) {
      setResult({ kind: "available", url: group.whatsapp_url });
      return;
    }

    setResult({
      kind: "pending",
      message: group
        ? "Estem preparant aquest grup. Estarà disponible en breus."
        : "Encara no hi ha un grup disponible per a aquest institut.",
    });
  }

  return (
    <>
      <section className="finder-section" id="troba-el-teu-grup" aria-labelledby="finder-title">
        <div className="finder-copy">
          <h2 id="finder-title">Troba el teu grup de WhatsApp</h2>
          <p>
            Selecciona d’on vens i el teu institut per trobar el grup del vostre viatge de
            final de curs a Menorca.
          </p>
        </div>

        <div className="finder">
          <div className="finder__field">
            <SearchableSelect
              id="province"
              label="Província"
              value={provinceId}
              options={provinces}
              loading={loading.provinces}
              placeholder="Escriu o selecciona la teva província"
              onChange={(value) => void changeProvince(value)}
            />
          </div>

          <div className="finder__field">
            <SearchableSelect
              key={`county-${provinceId}`}
              id="county"
              label="Comarca"
              value={countyId}
              options={counties}
              loading={loading.counties}
              disabled={!provinceId || loading.counties}
              placeholder="Escriu o selecciona la teva comarca"
              onChange={(value) => void changeCounty(value)}
            />
          </div>

          <div className="finder__field">
            <SearchableSelect
              key={`institute-${countyId}`}
              id="institute"
              label="Institut"
              value={instituteId}
              options={institutes}
              loading={loading.institutes}
              disabled={!countyId || loading.institutes}
              placeholder="Escriu o selecciona el teu institut"
              onChange={(value) => {
                setInstituteId(value);
                void loadGroup(value);
              }}
            />
          </div>

          {result.kind === "available" && (
            <a
              className="button button--finder button--whatsapp"
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              ENTRAR AL MEU GRUP DE WHATSAPP
            </a>
          )}
          {result.kind !== "available" && (
            <button className="button button--finder" type="button" disabled>
              {result.kind === "loading"
                ? "CARREGANT EL GRUP…"
                : "ENTRAR AL MEU GRUP DE WHATSAPP"}
            </button>
          )}
          {result.kind === "pending" && (
            <p className="finder__result finder__result--pending" role="status">
              {result.message}
            </p>
          )}
        </div>

        <div className="finder-secondary">
          <button type="button" onClick={() => setSheet({ open: true, island: "menorca" })}>
            Necessites un grup personalitzat?
          </button>
          <button type="button" onClick={() => setSheet({ open: true, island: "" })}>
            Vas a Mallorca o Eivissa?
          </button>
        </div>
      </section>

      <CustomGroupSheet
        open={sheet.open}
        initialIsland={sheet.island}
        onClose={() => setSheet((current) => ({ ...current, open: false }))}
      />
    </>
  );
}
