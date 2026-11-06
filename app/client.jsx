"use client";
import { useEffect, useRef, useState } from "react";
import { TYPES } from "@/lib/content";

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
  const [quote, setQuote] = useState("");
  const [state, setState] = useState("idle");
  useEffect(() => {
    const a = (e) => setType(e.detail);
    const b = (e) => setQuote(e.detail);
    window.addEventListener("pick-type", a);
    window.addEventListener("quote", b);
    return () => {
      window.removeEventListener("pick-type", a);
      window.removeEventListener("quote", b);
    };
  }, []);

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const url = process.env.NEXT_PUBLIC_FORM_URL; // آدرس سرویس فرم یا بک‌اند (در Render تنظیم می‌شود)
      if (!url) { setState("off"); return; }
      const body = JSON.stringify({ ...Object.fromEntries(new FormData(form)), type, quote });
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body });
      if (r.ok) form.reset();
      setState(r.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="chips">
        {TYPES.map((t) => (
          <button type="button" key={t} className={"chip" + (type === t ? " on" : "")} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>
      {quote && (
        <p className="note">
          درخواست قیمت: {quote}{" "}
          <button type="button" className="chip" onClick={() => setQuote("")}>حذف</button>
        </p>
      )}
      <input name="name" placeholder="نام" aria-label="نام" required />
      <input name="contact" placeholder="شماره تماس یا ایمیل" aria-label="راه تماس" required />
      <textarea name="body" rows="4" placeholder="در یکی دو جمله بگو چه سایتی می‌خواهی" aria-label="توضیح پروژه" />
      <button className="cta" disabled={state === "sending"}>
        {state === "sending" ? "در حال ارسال…" : "ارسال پیام"}
      </button>
      {state === "ok" && <p className="note">پیامت ثبت شد. به‌زودی جواب می‌دهیم.</p>}
      {state === "off" && <p className="note">فرم هنوز به جایی وصل نیست. فعلاً از لینک‌های پایین پیام بده.</p>}
      {state === "err" && <p className="note">ارسال نشد. دوباره تلاش کن یا از لینک‌های پایین پیام بده.</p>}
    </form>
  );
}
