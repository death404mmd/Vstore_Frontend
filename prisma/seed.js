const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  if ((await db.project.count()) === 0) {
    await db.project.createMany({
      data: [1, 2, 3, 4].map((n) => ({
        title: "[نام پروژه]",
        summary: "[یک خط توضیح]",
        tag: "[نوع پروژه]",
        sort: n,
      })),
    });
  }
  console.log("seed ok");
  await db.$disconnect();
})();
