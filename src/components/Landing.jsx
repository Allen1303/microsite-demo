import { LANDING } from "../copy.js";

export default function Landing() {
  return (
    <section className="flex flex-col items-center gap-6 bg-ink px-[5vw] py-[clamp(5rem,14vh,9rem)] text-center">
      <span className="stamp">{LANDING.stamp}</span>
      <h2 className="display-head max-w-[24ch] text-[clamp(1.7rem,4.2vw,2.6rem)]">
        {LANDING.text}
      </h2>
    </section>
  );
}
