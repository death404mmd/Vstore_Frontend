import { PROJECTS } from "@/lib/projects";
import { BRAND, KICKER, INTRO, MARQUEE, SERVICES, STEPS, LINKS } from "@/lib/content";
import { StartButton, ContactForm, Glow } from "@/components/client";
import Quote from "@/components/Quote";

const T = ({ children }) =>
  String(children).startsWith("[") ? <span className="ph">{children}</span> : children;
const fa = (n) => n.toLocaleString("fa-IR");

export default async function Page() {
  const projects = PROJECTS;
  return (
    <>
      <nav className="nav">
        <a className="logo" href="#"><T>{BRAND}</T></a>
        <ul>
          <li><a href="#services">خدمات</a></li>
          <li><a href="#works">نمونه‌کارها</a></li>
          <li><a href="#quote">قیمت</a></li>
          <li><a href="#contact">تماس</a></li>
        </ul>
        <StartButton className="mini">شروع پروژه</StartButton>
      </nav>

      <Glow className="hero">
        <div className="hero-stage">
          <img className="hero-gif" src="/hero22.gif" alt="" decoding="async" fetchPriority="high" />
          <div className="hero-cta">
            <StartButton className="cta">پروژه‌ات را شروع کن</StartButton>
          </div>
        </div>
        <div className="hero-text"><div className="wrap">
          <p className="kicker">{KICKER}</p>
          <h1>Vstore a <em>will store</em></h1>
          <div className="hero-row">
            <p>{INTRO.split("[")[0]}{INTRO.includes("[") && <T>{"[" + INTRO.split("[")[1]}</T>}</p>
          </div>
        </div></div>
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

        <section id="quote" className="quote"><div className="wrap">
          <h2 className="sec"><span>{fa(4)}</span> قیمت تقریبی پروژه‌ات</h2>
          <Quote />
        </div></section>
{/*
        <section id="contact" className="contact"><div className="wrap">
          <h2 className="sec">پروژه‌ات چیه؟</h2>
          <ContactForm />
          <div className="links">
            {LINKS.map((l) => <a key={l.label} href={l.href} className={l.href === "#" ? "ph" : ""}>{l.label}</a>)}
          </div>
        </div></section> */}
      </main>

      <footer>© <T>[سال]</T> <T>{BRAND}</T></footer>
    </>
  );
}
