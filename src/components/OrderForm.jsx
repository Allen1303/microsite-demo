import { forwardRef, useState } from "react";

// Set this to a real form backend (Formspree, worker, etc.) to take live orders.
const ORDER_ENDPOINT = "";

const inputCls =
  "min-h-12 rounded-lg border-[1.5px] border-bone/25 bg-ink px-3.5 py-3 font-body text-bone focus:border-apricot focus:outline-none";

function Choice({ name, value, label, defaultChecked }) {
  return (
    <label className="flex min-h-12 flex-1 basis-40 cursor-pointer items-center gap-2.5 rounded-lg border-[1.5px] border-bone/25 px-3.5 py-3 has-checked:border-apricot has-checked:bg-apricot/8">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="size-4.5 accent-apricot"
      />
      <span>{label}</span>
    </label>
  );
}

const OrderForm = forwardRef(function OrderForm(_, sectionRef) {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();

    const next = {
      name: name.length === 0,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    };
    setErrors(next);
    if (next.name || next.email) {
      form.elements[next.name ? "name" : "email"].focus();
      return;
    }

    const order = {
      name,
      email,
      method: form.elements.method.value,
      grind: form.elements.grind.value,
      submittedAt: new Date().toISOString(),
    };

    setBusy(true);
    setStatus("Reserving your bag…");

    try {
      if (ORDER_ENDPOINT) {
        const res = await fetch(ORDER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error("Order endpoint returned " + res.status);
      } else {
        // demo mode: keep the order locally until a backend is wired up
        const key = "firstcrack-orders";
        const orders = JSON.parse(localStorage.getItem(key) || "[]");
        orders.push(order);
        localStorage.setItem(key, JSON.stringify(orders));
      }
      setStatus("");
      setSubmitted(true);
    } catch {
      setStatus("That didn't go through. Check your connection and press the button again.");
      setBusy(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="order"
      className="flex flex-col items-center bg-char px-[5vw] py-[clamp(5rem,14vh,9rem)] text-center"
    >
      <div className="flex w-[min(92vw,30rem)] flex-col items-center gap-6">
        <span className="stamp">THIS WEEK'S ROAST</span>
        <h2 className="display-head text-[clamp(1.7rem,4.2vw,2.6rem)]">
          Get this week's roast
        </h2>
        <p className="max-w-xl text-bone-dim">
          Small batches come off the drum every Tuesday. Reserve a bag — pick it
          up at the roastery or we'll deliver locally within days of roast, with
          the roast date stamped on every bag.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8" role="status">
            <span className="stamp text-apricot">RESERVED</span>
            <h3 className="font-display text-3xl font-semibold">You're in.</h3>
            <p className="max-w-md text-bone-dim">
              Your bag comes off the drum this week. We'll email you the roast
              date the moment it's stamped.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex w-full flex-col gap-5 text-left"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="fName" className="text-[0.9375rem] font-bold">
                Name
              </label>
              <input
                id="fName"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={errors.name || undefined}
                className={`${inputCls} ${errors.name ? "border-strawberry" : ""}`}
              />
              {errors.name && (
                <p className="text-[0.9375rem] text-strawberry">
                  Add your name so we know whose bag it is.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fEmail" className="text-[0.9375rem] font-bold">
                Email
              </label>
              <input
                id="fEmail"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={errors.email || undefined}
                className={`${inputCls} ${errors.email ? "border-strawberry" : ""}`}
              />
              {errors.email && (
                <p className="text-[0.9375rem] text-strawberry">
                  We need a working email to tell you when your bag is ready.
                </p>
              )}
            </div>

            <fieldset className="flex flex-col gap-2 border-none">
              <legend className="mb-2 text-[0.9375rem] font-bold">
                How do you want it?
              </legend>
              <div className="flex flex-wrap gap-3">
                <Choice name="method" value="pickup" label="Pickup at the roastery" defaultChecked />
                <Choice name="method" value="delivery" label="Local delivery" />
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2 border-none">
              <legend className="mb-2 text-[0.9375rem] font-bold">
                Whole bean or ground?
              </legend>
              <div className="flex flex-wrap gap-3">
                <Choice name="grind" value="whole" label="Whole bean" defaultChecked />
                <Choice name="grind" value="ground" label="Ground" />
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 min-h-14 cursor-pointer rounded-lg border-none bg-apricot px-6 py-4 font-body text-lg font-bold text-char hover:bg-apricot-bright active:translate-y-px disabled:cursor-wait disabled:opacity-60"
            >
              Reserve my bag — $18
            </button>
            <p role="status" className="min-h-[1.4em] text-center text-bone-dim">
              {status}
            </p>
          </form>
        )}
      </div>
    </section>
  );
});

export default OrderForm;
