// ارسال درخواست به Supabase با fetch ساده (بدون کتابخانه، تا سایت اصلی سبک بماند)
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const cut = (v, n) => String(v ?? "").trim().slice(0, n);

// خروجی: "ok" | "err" | "off" (یعنی Supabase هنوز تنظیم نشده)
export async function sendLead(d) {
  if (!URL_ || !KEY) return "off";
  if (d.website) return "ok"; // فیلد مخفی (honeypot): ربات‌ها پر می‌کنند، بی‌سروصدا نادیده می‌گیریم
  const headers = { "Content-Type": "application/json", apikey: KEY, Prefer: "return=minimal" };
  if (KEY.startsWith("eyJ")) headers.Authorization = "Bearer " + KEY; // کلید قدیمی (JWT)
  const row = {
    name: cut(d.name, 100), contact: cut(d.contact, 150), type: cut(d.type, 80),
    message: cut(d.message, 2000), quote: cut(d.quote, 600),
  };
  try {
    const r = await fetch(`${URL_}/rest/v1/leads`, { method: "POST", headers, body: JSON.stringify(row) });
    return r.ok ? "ok" : "err";
  } catch {
    return "err";
  }
}
