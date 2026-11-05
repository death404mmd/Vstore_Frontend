import { db } from "@/lib/db";

// TODO قبل از انتشار: محدودیت تعداد درخواست (rate limit) و ضد اسپم اضافه کن
export async function POST(req) {
  const d = await req.json().catch(() => null);
  const clean = (v, n) => String(v ?? "").trim().slice(0, n);
  const name = clean(d?.name, 100);
  const contact = clean(d?.contact, 150);
  if (!name || !contact) {
    return Response.json({ error: "نام و راه تماس لازم است." }, { status: 400 });
  }
  await db.message.create({
    data: { name, contact, body: clean(d?.body, 2000), type: clean(d?.type, 80) },
  });
  return Response.json({ ok: true });
}
