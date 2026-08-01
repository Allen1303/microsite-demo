import { useState } from "react";

const LINKS = [
  { href: "#story", label: "The story" },
  { href: "#why-fresh", label: "Why fresh" },
  { href: "#visit", label: "Visit" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 bg-gradient-to-b from-ink/85 to-transparent">
        <a href="#top" className="flex flex-col gap-1.5 no-underline">
          <span className="font-display font-bold text-[1.15rem] tracking-tight">
            First Crack Roasting&nbsp;Co.
          </span>
          <span className="stamp text-[0.6875rem] px-2.5 py-1">
            SMALL BATCH · ROASTED THIS WEEK
          </span>
        </a>

        <nav
          aria-label="Site"
          className="hidden md:flex items-center gap-7"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.9375rem] font-bold text-bone no-underline hover:text-apricot px-3 py-3"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#order"
            className="inline-flex items-center min-h-11 rounded-lg bg-bone px-5 py-2.5 text-[0.9375rem] font-bold text-char no-underline hover:bg-white active:translate-y-px"
          >
            Get this week's roast
          </a>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          {/* tablets get the CTA pill up top; phones rely on the bottom bar */}
          <a
            href="#order"
            className="hidden sm:inline-flex items-center min-h-11 rounded-lg bg-bone px-5 py-2.5 text-[0.9375rem] font-bold text-char no-underline hover:bg-white active:translate-y-px"
          >
            Get this week's roast
          </a>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-bone/25 bg-ink/60"
        >
          <span
            className={`block h-[2px] w-5 bg-bone transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`block h-[2px] w-5 bg-bone ${open ? "opacity-0" : ""}`} />
          <span
            className={`block h-[2px] w-5 bg-bone transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Site"
          className="md:hidden fixed inset-0 top-0 z-[-1] flex flex-col items-center justify-center gap-2 bg-ink/95 backdrop-blur-sm"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-semibold text-bone no-underline px-6 py-4 hover:text-apricot"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex min-h-13 items-center rounded-lg bg-apricot px-7 py-4 text-lg font-bold text-char no-underline"
          >
            Get this week's roast
          </a>
        </nav>
      )}
    </header>
  );
}
