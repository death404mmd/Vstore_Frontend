"use client";
import { useEffect, useRef, useState } from "react";
import { TYPES } from "@/lib/content";
import { sendLead } from "@/lib/lead";

export function Glow({ className, children }) {
  const raf = useRef(0);
  // با requestAnimationFrame: حداکثر یک به‌روزرسانی در هر فریم (مصرف کمتر)
  const move = (e) => {
    const el = e.currentTarget, x = e.clientX, y = e.clientY;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", x - r.left + "px");
      el.style.setProperty("--my", y - r.top + "px");
    });
  };
  return <header className={className} onMouseMove={move}>{children}</header>;
}

export function StartButton({ className, children }) {
  const ref = useRef(null);
  const pick = (t) => {
    window.dispatchEvent(new CustomEvent("pick-type", { detail: t }));
    ref.current.close();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <button className={className} onClick={() => ref.current.showModal()}>{children}</button>
      <dialog ref={ref} onClick={(e) => e.target === ref.current && ref.current.close()}>
        <h3>چه سایتی می‌خواهی؟</h3>
        <div className="opts">
          {TYPES.map((t) => <button key={t} onClick={() => pick(t)}>{t}</button>)}
        </div>
        <button className="x" onClick={() => ref.current.close()}>بستن</button>
      </dialog>
    </>
  );
}

export function ContactForm() {
  const [type, setType] = useState("");
  const [state, setState] = useState("idle");
  useEffect(() => {
    const h = (e) => setType(e.detail);
    window.addEventListener("pick-type", h);
    return () => window.removeEventListener("pick-type", h);
  }, []);

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    setState("sending");
    const r = await sendLead({ name: f.name, contact: f.contact, message: f.body, type, website: f.website });
    if (r === "ok") form.reset();
    setState(r);
  }

  return (
    <form onSubmit={submit}>
      <div className="chips">
        {TYPES.map((t) => (
          <button type="button" key={t} className={"chip" + (type === t ? " on" : "")} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>
      <input name="name" placeholder="نام" aria-label="نام" required maxLength={100} />
      <input name="contact" placeholder="شماره تماس یا ایمیل" aria-label="راه تماس" required minLength={3} maxLength={150} />
      <textarea name="body" rows="4" maxLength={2000} placeholder="در یکی دو جمله بگو چه سایتی می‌خواهی" aria-label="توضیح پروژه" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      <button className="cta" disabled={state === "sending"}>
        {state === "sending" ? "در حال ارسال…" : "ارسال پیام"}
      </button>
      {state === "ok" && <p className="note">پیامت ثبت شد. به‌زودی جواب می‌دهیم.</p>}
      {state === "err" && <p className="note">ارسال نشد. دوباره تلاش کن یا از لینک‌های پایین پیام بده.</p>}
      {state === "off" && <p className="note">فرم هنوز وصل نیست. فعلاً از لینک‌های پایین پیام بده.</p>}
    </form>
  );
}
