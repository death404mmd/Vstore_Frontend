import { db } from "@/lib/db";
import { BRAND, KICKER, INTRO, MARQUEE, SERVICES, STEPS, TEAM, LINKS } from "@/lib/content";
import { StartButton, ContactForm, Glow } from "@/components/client";

export const dynamic = "force-dynamic";

const T = ({ children }) =>
  String(children).startsWith("[") ? <span className="ph">{children}</span> : children;
const fa = (n) => n.toLocaleString("fa-IR");

async function getProjects() {
  try {
    return await db.project.findMany({ where: { published: true }, orderBy: [{ sort: "asc" }, { id: "asc" }] });
  } catch {
    return [];
  }
}

export default async function Page() {
  const projects = await getProjects();
  return (
    <>
      <nav className="nav">
        <a className="logo" href="/img/logo.png"><T>{BRAND}</T></a>
        <ul>
          <li><a href="#services">خدمات</a></li>
          <li><a href="#works">نمونه‌کارها</a></li>
          <li><a href="#about">درباره ما</a></li>
          <li><a href="#contact">تماس</a></li>
        </ul>
        <StartButton className="mini">شروع پروژه</StartButton>
      </nav>

      <Glow className="hero">
        <div className="wrap">
          <p className="kicker">{KICKER}</p>
          <h1>سایتی می‌سازیم که <em>می‌فروشد.</em></h1>
          <div className="hero-row">
            <p>{INTRO.split("[")[0]}{INTRO.includes("[") && <T>{"[" + INTRO.split("[")[1]}</T>}</p>
            <StartButton className="cta">پروژه‌ات را شروع کن</StartButton>
          </div>
        </div>
        <div className="sticker" aria-hidden="true">از ایده<br />تا فروش</div>
      </Glow>

      <div className="marquee" aria-hidden="true">
        <div>
          {[0, 1].map((i) => (
            <span key={i}>{MARQUEE.map((m) => <b key={m}>{m} ✦</b>)}</span>
          ))}
        </div>
      </div>

      <main>
        <section id="services"><div className="wrap">
          <h2 className="sec"><span>{fa(1)}</span> چه چیزی می‌سازیم</h2>
          <ul className="svc">
            {SERVICES.map((s, i) => (
              <li key={s.title}>
                <span className="n">{fa(i + 1).padStart(2, "۰")}</span>
                <b>{s.title}</b>
                <p>{s.text} <T>{s.extra}</T></p>
              </li>
            ))}
          </ul>
        </div></section>

        <section id="works"><div className="wrap">
          <h2 className="sec"><span>{fa(2)}</span> نمونه‌کارها</h2>
          {projects.length === 0 && <p>هنوز پروژه‌ای ثبت نشده.</p>}
          <div className="works">
            {projects.map((p) => (
              <article className="work" key={p.id}>
                <div className="pic">{p.imageUrl ? <img src={p.imageUrl} alt={p.title} /> : "[عکس پروژه]"}</div>
                <div className="t">
                  <small><T>{p.tag}</T></small>
                  <h3><T>{p.title}</T></h3>
                  <p><T>{p.summary}</T></p>
                </div>
              </article>
            ))}
          </div>
        </div></section>

        <section><div className="wrap">
          <h2 className="sec"><span>{fa(3)}</span> مسیر کار با ما</h2>
          <ol className="steps">
            {STEPS.map(([t, d]) => <li key={t}><b>{t}</b><br />{d}</li>)}
          </ol>
        </div></section>

        <section id="about" className="band"><div className="wrap">
          <h2 className="sec"><span>{fa(4)}</span> ما کی هستیم</h2>
          <div className="team">
            {TEAM.map((m, i) => <div key={i}><b><T>{m.name}</T></b><T>{m.role}</T></div>)}
          </div>
        </div></section>

        <section id="contact" className="contact"><div className="wrap">
          <h2 className="sec">پروژه‌ات چیه؟</h2>
          <ContactForm />
          <div className="links">
            {LINKS.map((l) => <a key={l.label} href={l.href} className={l.href === "#" ? "ph" : ""}>{l.label}</a>)}
          </div>
        </div></section>
      </main>

      <footer>© <T>[سال]</T> <T>{BRAND}</T></footer>
    </>
  );
}
