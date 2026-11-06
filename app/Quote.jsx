"use client";
import { useState } from "react";
import { PRICING as P } from "@/lib/pricing";

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
  const pick = (k) => (v) => setS((p) => ({ ...p, [k]: v }));
  const toggle = (id) =>
    setS((p) => ({ ...p, feats: p.feats.includes(id) ? p.feats.filter((x) => x !== id) : [...p.feats, id] }));

  const t = find(P.types, s.type), z = find(P.sizes, s.size), v = find(P.speeds, s.speed);
  const feats = P.features.filter((f) => s.feats.includes(f.id));
  const mid = (t.base + feats.reduce((a, f) => a + f.price, 0)) * z.mult * v.mult;
  const range = `${nf.format(half(mid * P.low))} تا ${nf.format(half(mid * P.high))} میلیون تومان`;

  const send = () => {
    const summary = [t.label, feats.map((f) => f.label).join("، ") || "بدون امکانات اضافه", z.label, v.label, range].join(" | ");
    window.dispatchEvent(new CustomEvent("quote", { detail: summary }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

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
        <button className="cta" onClick={send}>همین را درخواست بده</button>
      </div>
    </>
  );
}
