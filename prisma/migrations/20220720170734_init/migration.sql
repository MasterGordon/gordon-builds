-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "twitch" TEXT,
    "twitter" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildItem" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "buildItemCategoryId" TEXT,

    CONSTRAINT "BuildItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildItemCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "buildSlug" TEXT,

    CONSTRAINT "BuildItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "complexity" INTEGER NOT NULL,
    "trollLevel" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "heroKey" TEXT NOT NULL,
    "skills" TEXT[],
    "talents" TEXT[],

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Build_slug_key" ON "Build"("slug");

-- AddForeignKey
ALTER TABLE "BuildItem" ADD CONSTRAINT "BuildItem_buildItemCategoryId_fkey" FOREIGN KEY ("buildItemCategoryId") REFERENCES "BuildItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildItemCategory" ADD CONSTRAINT "BuildItemCategory_buildSlug_fkey" FOREIGN KEY ("buildSlug") REFERENCES "Build"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
