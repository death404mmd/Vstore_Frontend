"use client";
import { useRef, useState } from "react";
import { PRICING as P } from "@/lib/pricing";
import { sendLead } from "@/lib/lead";
import "./quote.css";

// بدون کتابخانه: محاسبه در همان رندر انجام می‌شود (ساده و سبک)
const nf = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const half = (n) => Math.round(n * 2) / 2;
const find = (arr, id) => arr.find((x) => x.id === id);

function Group({ title, name, items, value, onPick }) {
  return (
    <fieldset>
      <legend>{title}</legend>
      <div className="opts2">
        {items.map((i) => (
          <label className="opt" key={i.id}>
            <input type="radio" name={name} checked={value === i.id} onChange={() => onPick(i.id)} />
            <span>{i.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Quote() {
  const [s, setS] = useState({ type: P.types[0].id, size: "s", speed: "n", feats: ["pay", "admin"] });
  const [status, setStatus] = useState("idle");
  const dlg = useRef(null);
  const pick = (k) => (v) => setS((p) => ({ ...p, [k]: v }));
  const toggle = (id) =>
    setS((p) => ({ ...p, feats: p.feats.includes(id) ? p.feats.filter((x) => x !== id) : [...p.feats, id] }));

  const t = find(P.types, s.type), z = find(P.sizes, s.size), v = find(P.speeds, s.speed);
  const feats = P.features.filter((f) => s.feats.includes(f.id));
  const mid = (t.base + feats.reduce((a, f) => a + f.price, 0)) * z.mult * v.mult;
  const range = `${nf.format(half(mid * P.low))} تا ${nf.format(half(mid * P.high))} میلیون تومان`;

  const summary = [t.label, feats.map((f) => f.label).join("، ") || "بدون امکانات اضافه", z.label, v.label, range].join(" | ");
  const open = () => { setStatus("idle"); dlg.current.showModal(); };
  async function submit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setStatus(await sendLead({ name: f.name, contact: f.contact, website: f.website, quote: summary }));
  }

  return (
    <>
      <div className="qgrid">
        <Group title="چه سایتی؟" name="type" items={P.types} value={s.type} onPick={pick("type")} />
        <fieldset>
          <legend>چه امکاناتی؟</legend>
          <div className="opts2">
            {P.features.map((f) => (
              <label className="opt" key={f.id}>
                <input type="checkbox" checked={s.feats.includes(f.id)} onChange={() => toggle(f.id)} />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Group title="اندازه" name="size" items={P.sizes} value={s.size} onPick={pick("size")} />
        <Group title="زمان‌بندی" name="speed" items={P.speeds} value={s.speed} onPick={pick("speed")} />
      </div>
      <div className="qres">
        <div>
          <small>قیمت تقریبی</small>
          <output aria-live="polite">{range}</output>
          <small>{v.weeks}. قیمت نهایی بعد از گفتگو مشخص می‌شود.</small>
          {P.note.startsWith("[") && <small><span className="ph">{P.note}</span></small>}
        </div>
        <button className="cta" onClick={open}>همین را درخواست بده</button>
      </div>
      <dialog ref={dlg} className="qdlg" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        {status === "ok" ? (
          <div>
            <h3>درخواستت ثبت شد ✓</h3>
            <p>به‌زودی باهات تماس می‌گیریم.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3>برای ثبت درخواست</h3>
            <p className="sum">{summary}</p>
            <input name="name" placeholder="نام" aria-label="نام" required maxLength={100} autoComplete="name" />
            <input name="contact" type="tel" inputMode="tel" placeholder="شماره تماس" aria-label="شماره تماس" required minLength={7} maxLength={30} autoComplete="tel" />
            <div hidden><input name="website" tabIndex={-1} autoComplete="off" /></div>
            <button className="cta" disabled={status === "sending"}>{status === "sending" ? "در حال ارسال…" : "ثبت درخواست"}</button>
            {status === "err" && <p className="note">ارسال نشد. دوباره تلاش کن.</p>}
            {status === "off" && <p className="note">سیستم ثبت هنوز وصل نیست.</p>}
          </form>
        )}
        <button className="x" onClick={() => dlg.current.close()}>بستن</button>
      </dialog>
    </>
  );
}
