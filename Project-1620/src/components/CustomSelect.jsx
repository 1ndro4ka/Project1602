import { useState, useEffect, useRef } from "react";
import "../style/CustomSelect.css";

function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`cs${open ? " cs--open" : ""}`} ref={ref}>
      <button
        type="button"
        className="cs__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cs__label">{selected.label}</span>
        <svg
          className="cs__arrow"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <ul className="cs__dropdown" role="listbox">
        {options.map((opt) => (
          <li
            key={opt.value}
            className={`cs__option${opt.value === value ? " cs__option--selected" : ""}`}
            role="option"
            aria-selected={opt.value === value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            <svg
              className="cs__check"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8l3.5 3.5L13 5" />
            </svg>
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomSelect;