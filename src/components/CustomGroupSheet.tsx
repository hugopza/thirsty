"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  open: boolean;
  initialIsland: "menorca" | "";
  onClose: () => void;
};

export function CustomGroupSheet({ open, initialIsland, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.classList.add("sheet-open");
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href]',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("sheet-open");
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
      setStatus("idle");
    };
  }, [onClose, open]);

  if (!open) return null;

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    const destination = data.get("island");
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const approxPeople = Number(data.get("people"));

    if (
      !["menorca", "mallorca", "ibiza"].includes(String(destination)) ||
      !name ||
      !phone ||
      !Number.isInteger(approxPeople) ||
      approxPeople < 1
    ) {
      setStatus("error");
      return;
    }

    const { error } = await createSupabaseBrowserClient()
      .from("custom_group_requests")
      .insert({
        approx_people: approxPeople,
        destination: destination as "menorca" | "mallorca" | "ibiza",
        name,
        phone,
      });

    setStatus(error ? "error" : "success");
  }

  return (
    <div className="sheet" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-group-title"
      >
        <button
          ref={closeButtonRef}
          className="sheet__close"
          type="button"
          onClick={onClose}
          aria-label="Tancar el formulari"
        >
          ×
        </button>

        {status === "success" ? (
          <div className="sheet__success" role="status">
            <h2 id="custom-group-title">Sol·licitud enviada</h2>
            <p>Et contactarem per WhatsApp.</p>
            <button className="button button--dark" type="button" onClick={onClose}>
              TANCAR
            </button>
          </div>
        ) : (
          <>
            <h2 id="custom-group-title">Sol·licita el teu grup</h2>
            <form className="custom-form" onSubmit={submitRequest}>
              <label htmlFor="island">Illa</label>
              <select id="island" name="island" defaultValue={initialIsland} required>
                <option value="" disabled>Selecciona una illa</option>
                <option value="menorca">Menorca</option>
                <option value="mallorca">Mallorca</option>
                <option value="ibiza">Eivissa</option>
              </select>

              <label htmlFor="custom-name">Nom</label>
              <input id="custom-name" name="name" type="text" autoComplete="name" required />

              <label htmlFor="custom-phone">Telèfon</label>
              <input
                id="custom-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
              />

              <label htmlFor="custom-people">Nombre aproximat de persones</label>
              <input id="custom-people" name="people" type="number" min="1" step="1" required />

              {status === "error" && (
                <p className="form-message form-message--error" role="alert">
                  No s’ha pogut enviar. Revisa les dades i torna-ho a provar.
                </p>
              )}

              <button className="button button--dark" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "ENVIANT…" : "SOL·LICITAR GRUP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
