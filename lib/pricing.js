export const PRICING = {
    note: "قیمت ها تقریبی است و بعد از تنظیم قرارداد نهایی میشود.",
    low: 0.85, // کف بازه = قیمت × ۰٫۸۵
    high: 1.25, // سقف بازه = قیمت × ۱٫۲۵
    types: [
        { id: "type-shop", label: "فروشگاه آنلاین", base: 16 },
        { id: "type-corp", label: "سایت شرکتی", base: 8 },
        { id: "type-panel", label: "پنل مدیریت", base: 12 },
        { id: "type-doctor", label: "پنل نوبت دهی آنلاین", base: 20 },

    ],
    features: [
        { id: "pay", label: "درگاه پرداخت", price: 2 },
        { id: "admin", label: "پنل ادمین", price: 3 },
        { id: "user", label: "پنل کاربری", price: 3 },
        { id: "seo", label: "سئوی پایه", price: 1.5 },
        { id: "img", label: "آپلود و کراپ عکس", price: 1.5 },
        { id: "lang", label: "چندزبانه", price: 3 },
    ],
    sizes: [
        { id: "s", label: "کوچک (تا ۵ صفحه)", mult: 1 },
        { id: "m", label: "متوسط (تا ۱۵ صفحه)", mult: 1.4 },
        { id: "l", label: "بزرگ", mult: 2 },
    ],
    speeds: [
        { id: "n", label: "عادی", mult: 1, weeks: "حدود ۴ تا ۶ هفته" },
        { id: "f", label: "فوری", mult: 1.3, weeks: "حدود ۲ تا ۳ هفته" },
    ],
};