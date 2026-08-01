import { useEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import Film from "./components/Film.jsx";
import Landing from "./components/Landing.jsx";
import Bloom from "./components/Bloom.jsx";
import Worth from "./components/Worth.jsx";
import OrderForm from "./components/OrderForm.jsx";
import Footer from "./components/Footer.jsx";
import CtaBar from "./components/CtaBar.jsx";

export default function App() {
  const filmRef = useRef(null);
  const orderRef = useRef(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    let orderInView = false;

    const io = new IntersectionObserver(
      (entries) => {
        orderInView = entries[0].isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );
    if (orderRef.current) io.observe(orderRef.current);

    function update() {
      const el = filmRef.current;
      let past = window.scrollY > window.innerHeight * 1.5;
      if (el) {
        const rect = el.getBoundingClientRect();
        const track = rect.height - window.innerHeight;
        if (track > 0) past = -rect.top / track > 0.34;
      }
      setShowBar(past && !orderInView);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <Film ref={filmRef} />
      <Landing />
      <Bloom />
      <Worth />
      <OrderForm ref={orderRef} />
      <Footer />
      <CtaBar visible={showBar} />
    </>
  );
}
