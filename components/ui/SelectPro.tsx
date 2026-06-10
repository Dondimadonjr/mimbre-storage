"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectProOption = {
  label: string;
  value: string;
};

type SelectProProps = {
  label?: string;
  value: string;
  options: SelectProOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export default function SelectPro({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
  disabled = false,
  className = "",
  fullWidth = false,
}: SelectProProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {label ? (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-coffee"
        >
          {label}
        </label>
      ) : null}

      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 text-left text-sm font-semibold text-text-dark shadow-sm outline-none transition duration-300 hover:border-coffee/35 hover:shadow-md focus:border-coffee focus:ring-4 focus:ring-coffee/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>

        <span
          aria-hidden="true"
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream text-coffee transition duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-120 mt-2 max-h-72 overflow-auto rounded-2xl border border-border bg-white p-2 shadow-[0_20px_55px_rgba(49,39,31,0.16)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition duration-200 ${
                  isSelected
                    ? "bg-coffee text-white"
                    : "text-text-dark hover:bg-cream hover:text-coffee-dark"
                }`}
              >
                <span>{option.label}</span>
                {isSelected ? <span aria-hidden="true">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
