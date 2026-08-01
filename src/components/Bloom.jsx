import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1600;

const NOTES = [
  { name: "blueberry", cls: "bg-[radial-gradient(circle,var(--color-blueberry),transparent_70%)] -left-[12%] top-[4%]" },
  { name: "strawberry", cls: "bg-[radial-gradient(circle,var(--color-strawberry),transparent_70%)] -right-[14%] -top-[8%]" },
  { name: "apricot", cls: "bg-[radial-gradient(circle,var(--color-apricot),transparent_70%)] left-[12%] -bottom-[18%]" },
];

/**
 * The signature interaction: press and hold the cup and the tasting notes
 * bloom through it like ink — let go early and it settles back.
 */
export default function Bloom() {
  const noteRefs = useRef([]);
  const state = useRef({ holding: false, holdStart: null, p: 0, p0: 0, raf: 0 });
  const [done, setDone] = useState(false);
  const [reduced, setReduced] = useState(false);

  function render(p) {
    noteRefs.current.forEach((n, i) => {
      if (!n) return;
      const local = Math.min(1, Math.max(0, p * 1.6 - i * 0.22));
      n.style.transform = `scale(${local * 1.15})`;
      n.style.opacity = local * 0.95;
    });
  }

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setDone(true);
      render(1);
    }
    return () => cancelAnimationFrame(state.current.raf);
  }, []);

  function frame(ts) {
    const s = state.current;
    if (s.holding) {
      if (s.holdStart === null) s.holdStart = ts;
      s.p = Math.min(1, (ts - s.holdStart) / HOLD_MS + s.p0);
      if (s.p >= 1) {
        setDone(true);
        render(1);
        return;
      }
    } else if (s.p > 0) {
      s.p = Math.max(0, s.p - 0.02);
    }
    render(s.p);
    if (s.holding || s.p > 0) s.raf = requestAnimationFrame(frame);
  }

  function startHold(e) {
    const s = state.current;
    if (done || s.holding) return;
    e.preventDefault();
    s.holding = true;
    s.holdStart = null;
    s.p0 = s.p;
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(frame);
  }

  function endHold() {
    state.current.holding = false;
    state.current.holdStart = null;
  }

  return (
    <section
      className="flex flex-col items-center gap-6 bg-char px-[5vw] py-[clamp(5rem,14vh,9rem)] text-center"
      aria-label="Press and hold the cup"
    >
      <button
        type="button"
        aria-label="Press and hold to bloom the cup — the tasting notes spread while you hold"
        className="relative aspect-square w-[clamp(180px,42vw,260px)] cursor-pointer touch-none overflow-hidden rounded-full border-none bg-[radial-gradient(circle_at_42%_36%,#3A2E22,#241C13_62%,#17130F)] shadow-[inset_0_6px_24px_rgba(13,11,8,0.9),0_18px_50px_rgba(13,11,8,0.7)]"
        style={{ WebkitTapHighlightColor: "transparent" }}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onPointerLeave={endHold}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) startHold(e);
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") endHold();
        }}
      >
        <span className="absolute inset-[6%] block overflow-hidden rounded-full" aria-hidden="true">
          {NOTES.map((note, i) => (
            <span
              key={note.name}
              ref={(el) => (noteRefs.current[i] = el)}
              className={`absolute aspect-square w-[90%] rounded-full opacity-0 blur-[14px] will-change-[transform,opacity] ${note.cls}`}
              style={{ transform: "scale(0)" }}
            />
          ))}
        </span>
        <span
          className="pointer-events-none absolute inset-0 rounded-full border-[3px] border-bone/20"
          aria-hidden="true"
        />
      </button>

      <p className="font-stamp text-sm uppercase tracking-[0.22em] text-bone-dim">
        {done
          ? reduced
            ? "THE NOTES, IN THE CUP."
            : "THAT'S THE FIRST SIP."
          : "Press and hold the cup."}
      </p>

      <p
        aria-live="polite"
        className={`font-display max-w-[26ch] text-[clamp(1.2rem,3.2vw,1.6rem)] transition-[opacity,transform] duration-500 ${
          done ? "opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        Blueberry. Strawberry. Apricot.{" "}
        <strong className="font-semibold text-apricot">That's what you'll taste.</strong>
      </p>
    </section>
  );
}
