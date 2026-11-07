import { PROJECTS } from "@/lib/projects";
import { BRAND, SERVICES, STEPS, LINKS } from "@/lib/content";
import { Glow } from "@/components/client";
import Quote from "@/components/Quote";

// هر متنی که با «[» شروع شود زرد نشان داده می‌شود (یادآور جای خالی)
const T = ({ children }) =>
  String(children).startsWith("[") ? <span className="ph">{children}</span> : children;
const fa = (n) => n.toLocaleString("fa-IR");
const Brand = () =>
  BRAND.startsWith("[") ? <span className="ph">{BRAND}</span> : <><b>{BRAND[0]}</b>{BRAND.slice(1)}</>;

// آیکون‌های ساده (خط‌ای) بدون کتابخانه
const Icon = ({ d, d2 }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} />{d2 && <path d={d2} />}</svg>
);
const PLANE = "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z";
const MAIL = "M3 6h18v12H3z", MAIL2 = "m3 7 9 7 9-7";
const EXT = "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5";
const HOME = "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z";
const LAYERS = "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5";

export default function Page() {
  return (
    <>
      <nav className="nav">
        <a className="mini" href="#quote">شروع پروژه</a>
        <ul>
          <li><a href="#">خانه</a></li>
          <li><a href="#services">خدمات</a></li>
          <li><a href="#works">پروژه‌ها</a></li>
          <li><a href="#steps">مراحل ساخت</a></li>
          <li><a href="#quote">قیمت</a></li>
          <li><a href="#contact">تماس با من</a></li>
        </ul>
        <a className="logo" href="#"><Brand /></a>
      </nav>

      <Glow className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="brand"><Brand /></h1>
            <div className="hero-btns">
              <a className="btn-main" href="#works">مشاهده پروژه‌ها <Icon d={PLANE} /></a>
              <a className="btn-out" href="#contact">تماس با من <Icon d={MAIL} d2={MAIL2} /></a>
            </div>
          </div>
          <div className="hero-art">
            {/* عکس لپ‌تاپ: فایلت را با همین اسم توی پوشه public بگذار */}
            <img className="hero-laptop" src="/laptop.png" alt="" decoding="async" fetchPriority="high" />
          </div>
        </div>
      </Glow>

      <main>
        <section id="services"><div className="wrap">
          <h2 className="sec">چه چیزی می‌سازیم</h2>
          <ul className="svc">
            {SERVICES.map((s, i) => (
              <li key={s.title}>
                <span className="n">{fa(i + 1)}</span>
                <b>{s.title}</b>
                <p>{s.text} <T>{s.extra}</T></p>
              </li>
            ))}
          </ul>
        </div></section>

        <section id="works"><div className="wrap">
          <h2 className="sec">پروژه‌های منتخب</h2>
          {PROJECTS.length === 0 && <p>هنوز پروژه‌ای ثبت نشده.</p>}
          <div className="works">
            {PROJECTS.map((p) => {
              const tags = p.tags ?? (p.tag ? [p.tag] : []);
              return (
                <article className="work" key={p.id}>
                  <div className="pic">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.title} loading="lazy" decoding="async" /> : "[عکس پروژه]"}
                  </div>
                  <div className="t">
                    <div className="top">
                      <h3><T>{p.title}</T></h3>
                      {p.link && <a className="ext" href={p.link} target="_blank" rel="noopener noreferrer" aria-label="مشاهده پروژه"><Icon d={EXT} /></a>}
                    </div>
                    <p><T>{p.summary}</T></p>
                    {tags.length > 0 && <div className="tags">{tags.map((t) => <span className="tag" key={t}><T>{t}</T></span>)}</div>}
                  </div>
                </article>
              );
            })}
          </div>
        </div></section>

        <section id="steps" className="stepsec"><div className="wrap"><div className="band">
          <h2>مراحل ساخت سایت</h2>
          <ol className="steps">
            {STEPS.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
          </ol>
        </div></div></section>

        <section id="quote" className="quote"><div className="wrap">
          <h2 className="sec">قیمت تقریبی پروژه‌ات</h2>
          <p className="sec-sub">امکانات رو انتخاب کن، قیمت و زمان تقریبی رو همین‌جا ببین و درخواستت رو ثبت کن.</p>
          <Quote />
        </div></section>

      </main>

      <footer id="contact"><div className="wrap">
        <p className="fh">راه‌های ارتباطی</p>
        <div className="links">
          {LINKS.map((l) => <a key={l.label} href={l.href} className={l.href === "#" ? "ph" : ""}>{l.label}</a>)}
        </div>
        <p className="copy">© <T>[سال]</T> <T>{BRAND}</T></p>
      </div></footer>

      <nav className="tabbar" aria-label="ناوبری">
        <a href="#"><Icon d={HOME} /><span>خانه</span></a>
        <a href="#works"><Icon d={LAYERS} /><span>پروژه‌ها</span></a>
        <a href="#contact"><Icon d={MAIL} d2={MAIL2} /><span>تماس</span></a>
      </nav>
    </>
  );
}
