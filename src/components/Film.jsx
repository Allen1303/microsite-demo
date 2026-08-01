import { forwardRef, useEffect, useRef, useState } from "react";
import { CAPTIONS, CLIPS } from "../copy.js";

const BASE = import.meta.env.BASE_URL;

/**
 * The scroll-film: 6 clips shot as one continuous camera move, scrubbed by
 * scroll. Falls back to still keyframes when motion is reduced, data is
 * constrained, or a clip fails to load.
 */
const Film = forwardRef(function Film(_, sectionRef) {
  const videoRefs = useRef([]);
  const captionRefs = useRef([]);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reducedMotion || saveData) {
      setDead(true);
      return;
    }

    let raf;
    let activeClip = -1;
    const n = CLIPS.length;

    // clips 1-2 preload up front; the rest fetch one segment ahead of the scroll
    const loadStarted = CLIPS.map((_, i) => i < 2);
    function ensureLoaded(i) {
      if (i < 0 || i >= n || loadStarted[i]) return;
      loadStarted[i] = true;
      const v = videoRefs.current[i];
      if (v) {
        v.preload = "auto";
        v.load();
      }
    }

    function progress() {
      const el = sectionRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const track = rect.height - window.innerHeight;
      if (track <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / track));
    }

    function tick() {
      const p = progress();
      const seg = Math.min(n - 1, Math.floor(p * n));
      const local = p * n - seg;

      ensureLoaded(seg);
      ensureLoaded(seg + 1);

      if (seg !== activeClip) {
        videoRefs.current.forEach((v, i) => {
          if (v) v.style.opacity = i === seg ? "1" : "0";
        });
        activeClip = seg;
      }

      const v = videoRefs.current[seg];
      if (v && v.readyState >= 1 && v.duration && !v.seeking) {
        const target = local * v.duration;
        const diff = target - v.currentTime;
        if (Math.abs(diff) > 1.2) {
          // big jump (anchor link, flick): snap instead of storming the decoder
          v.currentTime = target;
        } else if (Math.abs(diff) > 0.04) {
          // small deltas: lerp so scrubbing stays smooth on sparse keyframes
          v.currentTime = v.currentTime + diff * 0.35;
        }
      }

      // each caption owns a window just after its seam
      captionRefs.current.forEach((cap, i) => {
        if (!cap) return;
        const start = i === 0 ? -1 : i / n + 0.006;
        const end = i / n + 0.14;
        cap.classList.toggle("caption-on", p >= start && p <= end);
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sectionRef]);

  if (dead) {
    return (
      <section
        ref={sectionRef}
        id="story"
        aria-label="The story of a fresh cup, in stills"
      >
        {[...CAPTIONS.map((c, i) => ({ ...c, poster: i + 1 }))].map((cap) => (
          <div
            key={cap.stamp}
            className="relative flex min-h-[88svh] items-end justify-center bg-cover bg-center px-[4vw] pb-[calc(max(1rem,env(safe-area-inset-bottom))+5.5rem)]"
            style={{ backgroundImage: `url(${BASE}assets/posters/k${cap.poster}.jpg)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-ink/10 from-50% to-ink/80" />
            <div className="relative z-1 flex w-[min(92vw,44rem)] flex-col items-center gap-3.5 text-center">
              <span className="stamp">{cap.stamp}</span>
              <h2 className="display-head text-[clamp(1.6rem,4.6vw,2.5rem)] [text-shadow:0_2px_24px_rgba(13,11,8,0.8)]">
                {cap.text}
              </h2>
              {cap.sub && (
                <p className="text-bone-dim [text-shadow:0_1px_12px_rgba(13,11,8,0.9)]">
                  {cap.sub}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative h-[900vh]"
      aria-label="The story of a fresh cup, told as one continuous shot"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {CLIPS.map((name, i) => (
          <video
            key={name}
            ref={(el) => (videoRefs.current[i] = el)}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100"
            muted
            playsInline
            preload={i < 2 ? "auto" : "none"}
            poster={`${BASE}assets/posters/k${i + 1}.jpg`}
            src={`${BASE}assets/video/${name}.mp4`}
            onError={() => setDead(true)}
          />
        ))}

        {/* vignette so copy stays readable over any frame */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(13,11,8,0.55),rgba(13,11,8,0)_30%),linear-gradient(rgba(13,11,8,0)_55%,rgba(13,11,8,0.72))]" />

        {CAPTIONS.map((cap, i) => (
          <div
            key={cap.stamp}
            ref={(el) => (captionRefs.current[i] = el)}
            className="caption pointer-events-none absolute bottom-[calc(max(1rem,env(safe-area-inset-bottom))+5.5rem)] left-1/2 flex w-[min(92vw,44rem)] -translate-x-1/2 flex-col items-center gap-3.5 text-center"
          >
            <span className="stamp">{cap.stamp}</span>
            {cap.hero ? (
              <h1 className="display-head text-[clamp(1.8rem,5.2vw,3.1rem)] [text-shadow:0_2px_24px_rgba(13,11,8,0.8)]">
                {cap.text}
              </h1>
            ) : (
              <h2 className="display-head text-[clamp(1.6rem,4.6vw,2.7rem)] [text-shadow:0_2px_24px_rgba(13,11,8,0.8)]">
                {cap.text}
              </h2>
            )}
            {cap.sub && (
              <p className="text-bone-dim [text-shadow:0_1px_12px_rgba(13,11,8,0.9)]">
                {cap.sub}
              </p>
            )}
            {cap.hero && (
              <p
                className="animate-hint-drift motion-reduce:animate-none font-stamp text-xs tracking-[0.3em] text-bone-dim"
                aria-hidden="true"
              >
                SCROLL
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});

export default Film;
