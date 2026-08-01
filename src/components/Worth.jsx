function Figure({ children }) {
  return (
    <span className="font-display text-[1.35em] font-bold text-bone">{children}</span>
  );
}

export default function Worth() {
  return (
    <section id="why-fresh" className="flex flex-col items-center gap-6 bg-ink px-[5vw] py-[clamp(5rem,14vh,9rem)] text-center">
      <span className="stamp">"IS IT WORTH IT?"</span>
      <h2 className="display-head max-w-[24ch] text-[clamp(1.7rem,4.2vw,2.6rem)]">
        Fair question. Here's the math.
      </h2>
      <div className="flex max-w-xl flex-col gap-4">
        <p className="text-lg text-bone-dim">
          <Figure>$18</Figure> a bag sounds like a lot next to the grocery aisle.
        </p>
        <p className="text-lg text-bone-dim">
          But a 340&nbsp;g bag makes about <Figure>25 cups</Figure>. That's{" "}
          <Figure>72¢ a cup</Figure> — for coffee at its peak, not past it.
        </p>
        <p className="text-lg font-medium text-apricot">
          The cheap bag has a hidden cost: you drink stale coffee most of the month.
        </p>
      </div>
    </section>
  );
}
