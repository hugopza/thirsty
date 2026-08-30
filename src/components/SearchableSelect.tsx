"use client";

import { KeyboardEvent, useMemo, useState } from "react";

type Option = { id: number; name: string };

type Props = {
  disabled?: boolean;
  id: string;
  label: string;
  loading?: boolean;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  value: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("ca");
}

export function SearchableSelect({
  disabled = false,
  id,
  label,
  loading = false,
  onChange,
  options,
  placeholder,
  value,
}: Props) {
  const selected = options.find((option) => String(option.id) === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const search = normalize(query.trim());
    if (!search || selected?.name === query) return options;
    return options.filter((option) => normalize(option.name).includes(search));
  }, [options, query, selected?.name]);

  function choose(option: Option) {
    setQuery(option.name);
    onChange(String(option.id));
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      if (filtered.length) {
        setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && filtered[activeIndex]) {
      event.preventDefault();
      choose(filtered[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const listboxId = `${id}-options`;
  const activeOptionId = filtered[activeIndex] ? `${id}-option-${filtered[activeIndex].id}` : undefined;

  return (
    <div className={`search-select${disabled ? " search-select--disabled" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="search-select__control">
        <input
          id={id}
          type="text"
          value={query}
          placeholder={loading ? "Carregant…" : placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? activeOptionId : undefined}
          aria-busy={loading}
          required
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            if (value) onChange("");
            setOpen(true);
          }}
        />
        <span className="search-select__arrow" aria-hidden="true">⌄</span>
      </div>

      {open && !disabled && (
        <ul id={listboxId} className="search-select__options" role="listbox">
          {filtered.length ? (
            filtered.map((option, index) => (
              <li
                id={`${id}-option-${option.id}`}
                key={option.id}
                role="option"
                aria-selected={String(option.id) === value}
                className={index === activeIndex ? "is-active" : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="search-select__empty">No hi ha resultats</li>
          )}
        </ul>
      )}
    </div>
  );
}
