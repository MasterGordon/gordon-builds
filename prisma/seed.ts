import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      name: "MasterGordon",
      role: "admin",
      password: "admin",
    },
  });
  await prisma.build.delete({
    where: {
      slug: "secret-carry-maiden",
    },
    include: {
      items: {
        include: {
          items: true,
        },
      },
    },
  });
  await prisma.build.create({
    data: {
      name: "Secret Carry Maiden",
      slug: "secret-carry-maiden",
      complexity: 1,
      trollLevel: 1,
      shortDescription:
        "A build that pretends to be a support, but is actually a carry that wins every teamfight.",
      description: `
# Gameplay
The Secret Carry Maiden is a build that pretends to be a support, but is actually a carry that wins every teamfight.

After you completed your Basic Items you are ready to start ganking. You should place smart wards to spot your enemies. And use smokes to gank lanes. With **Blink Dagger** and **Frostbite** you can get easy kill on the mid lane. If you really wanna carry you can get a point in to **Crystal Nova** to "secure" kills an accelerate you items.

When you completed you bkb you are ready to fuck. Just blink, pop your bkb and cast **Freezing Field** and the teamfight is won.
`,
      skills: [
        "          X XX X  ",
        "X X X X           ",
        " X X   XX         ",
        "",
        "",
        "     X     X     X",
      ],
      talents: ["  X ", "XX X"],
      items: {
        create: [
          {
            name: "Starting Items",
            items: {
              create: [
                { key: "item_tango" },
                { key: "item_clarity" },
                { key: "item_branches" },
                { key: "item_branches" },
                { key: "item_wind_lace" },
                { key: "item_ward_observer" },
                { key: "item_ward_sentry" },
              ],
            },
          },
          {
            name: "Basic Items",
            items: {
              create: [
                { key: "item_magic_wand" },
                { key: "item_tranquil_boots" },
                {
                  key: "item_bracer",
                  description: "Buy this item only if you die alot in lane.",
                },
                { key: "item_blink" },
              ],
            },
          },
        ],
      },
      heroKey: "npc_dota_hero_crystal_maiden",
      version: "7.30e",
    },
    include: {
      items: {
        include: {
          items: true,
        },
      },
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
