"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let client;
const sb = () => (client ??= createClient(URL_, KEY)); // فقط وقتی لازم شد ساخته می‌شود

const STATUS = { new: "جدید", contacted: "تماس گرفته شد", negotiating: "در حال مذاکره", won: "قطعی شد", lost: "منصرف شد" };
const fmt = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" });
const fa = (n) => n.toLocaleString("fa-IR");
const isTel = (s) => /^[+\d\s\-()۰-۹]{7,}$/.test(s);

function Login() {
  const [err, setErr] = useState("");
  async function go(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await sb().auth.signInWithPassword({ email: f.get("email"), password: f.get("password") });
    if (error) setErr("ایمیل یا رمز اشتباه است.");
  }
  return (
    <main className="adm narrow">
      <h1>ورود مدیر</h1>
      <form onSubmit={go}>
        <input name="email" type="email" placeholder="ایمیل" required autoComplete="username" />
        <input name="password" type="password" placeholder="رمز عبور" required autoComplete="current-password" />
        <button className="btn">ورود</button>
        {err && <p className="err">{err}</p>}
      </form>
    </main>
  );
}

function Leads() {
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await sb().from("leads").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) setMsg("خطا در دریافت اطلاعات.");
    else { setMsg(""); setRows(data); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const patch = async (id, fields) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...fields } : x)));
    const { error } = await sb().from("leads").update(fields).eq("id", id);
    if (error) { setMsg("ذخیره نشد."); load(); }
  };
  const del = async (id) => {
    if (!confirm("این درخواست حذف شود؟")) return;
    const { error } = await sb().from("leads").delete().eq("id", id);
    if (error) setMsg("حذف نشد.");
    else setRows((r) => r.filter((x) => x.id !== id));
  };

  const all = rows ?? [];
  const count = (s) => all.filter((r) => s === "all" || r.status === s).length;
  const needle = q.trim();
  const list = all.filter(
    (r) => (filter === "all" || r.status === filter) && (!needle || [r.name, r.contact, r.quote, r.message].join(" ").includes(needle))
  );

  return (
    <main className="adm">
      <div className="bar">
        <h1>درخواست‌ها</h1>
        <div>
          <button className="btn ghost" onClick={load}>تازه‌سازی</button>
          <button className="btn ghost" onClick={() => sb().auth.signOut()}>خروج</button>
        </div>
      </div>
      <input placeholder="جستجو در نام، شماره و توضیح…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="tabs">
        {["all", ...Object.keys(STATUS)].map((s) => (
          <button key={s} className={"tab" + (filter === s ? " on" : "")} onClick={() => setFilter(s)}>
            {s === "all" ? "همه" : STATUS[s]} ({fa(count(s))})
          </button>
        ))}
      </div>
      {msg && <p className="err">{msg}</p>}
      {rows === null && !msg && <p className="muted">در حال بارگذاری…</p>}
      {rows && list.length === 0 && <p className="muted">موردی نیست. (اگر مطمئنی درخواست هست، چک کن ایمیلت در جدول admins باشد.)</p>}
      {list.map((r) => (
        <article className="lead" key={r.id} data-s={r.status}>
          <header>
            <b>{r.name}</b>
            {isTel(r.contact) ? <a href={`tel:${r.contact}`}>{r.contact}</a> : <span>{r.contact}</span>}
            <time>{fmt.format(new Date(r.created_at))}</time>
          </header>
          {r.quote && <p className="q">{r.quote}</p>}
          {r.type && <small className="muted">نوع: {r.type}</small>}
          {r.message && <p>{r.message}</p>}
          <div className="row">
            <select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })} aria-label="وضعیت">
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <textarea rows={2} placeholder="یادداشت پیگیری…" defaultValue={r.note}
              onBlur={(e) => e.target.value !== r.note && patch(r.id, { note: e.target.value })} />
            <button className="btn danger" onClick={() => del(r.id)}>حذف</button>
          </div>
        </article>
      ))}
    </main>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = در حال بررسی
  useEffect(() => {
    if (!URL_ || !KEY) { setSession(null); return; }
    sb().auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb().auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!URL_ || !KEY) return <main className="adm"><p className="err">متغیرهای Supabase تنظیم نشده‌اند.</p></main>;
  if (session === undefined) return <main className="adm"><p className="muted">در حال بارگذاری…</p></main>;
  return session ? <Leads /> : <Login />;
}
