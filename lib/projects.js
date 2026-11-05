// نمونه‌کارها. فعلاً از اینجا خوانده می‌شوند (سایت استاتیک است).
// عکس‌ها را داخل پوشه public/projects بگذار و مثلاً بنویس: imageUrl: "/projects/shop.jpg"
// وقتی بک‌اند جدا ساختی، این آرایه جای خودش را به یک fetch می‌دهد.
export const PROJECTS = [1, 2, 3, 4].map((n) => ({
  id: n,
  title: "[نام پروژه]",
  summary: "[یک خط توضیح]",
  tag: "[نوع پروژه]",
  imageUrl: null,
}));
