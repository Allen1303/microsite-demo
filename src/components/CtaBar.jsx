export default function CtaBar({ visible }) {
  if (!visible) return null;
  return (
    <a
      href="#order"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 inline-flex min-h-13 -translate-x-1/2 items-center whitespace-nowrap rounded-lg bg-apricot px-7 py-4 font-bold text-char no-underline shadow-[0_10px_30px_rgba(13,11,8,0.6)]"
    >
      Get this week's roast
    </a>
  );
}
