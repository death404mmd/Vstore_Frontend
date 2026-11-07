import "./pattern.css";

// الگوهای نامنظم و شفاف پس‌زمینه. برای حذف: خط <Pattern /> را از page.jsx پاک کن
export default function Pattern() {
  return (
    <div className="bgart" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
    </div>
  );
}
