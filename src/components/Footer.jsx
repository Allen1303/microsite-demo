export default function Footer() {
  return (
    <footer id="visit" className="flex flex-col gap-2.5 bg-ink px-[5vw] pt-12 pb-28 text-center text-bone-dim">
      <p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-block px-2 py-3 text-bone underline underline-offset-3"
        >
          Visit the roastery
        </a>{" "}
        — 14 Mill Street · Tue–Sat, 7am–2pm
      </p>
      <p className="text-[0.9375rem]">
        First Crack Roasting Co. · Roasted in your neighborhood
      </p>
    </footer>
  );
}
