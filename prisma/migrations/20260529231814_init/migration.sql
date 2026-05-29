-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "park" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Attraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "park" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "threeLetterCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "openDate" TEXT,
    "sponsor" TEXT,
    "rideSystem" TEXT,
    "isIndoor" BOOLEAN NOT NULL DEFAULT true,
    "durationSec" INTEGER,
    "capacity" INTEGER,
    "vehicleNote" TEXT,
    "promiseTime" INTEGER,
    "dispatchTime" INTEGER,
    "rotationClass" TEXT,
    "rotationNote" TEXT,
    "hasDPA" BOOLEAN NOT NULL DEFAULT false,
    "hasSingleRider" BOOLEAN NOT NULL DEFAULT false,
    "passNote" TEXT,
    "heightMin" INTEGER,
    "restrictionNote" TEXT,
    "bgs" TEXT,
    "details" TEXT,
    "operationNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "statusNote" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Attraction_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_park_code_key" ON "Area"("park", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Attraction_threeLetterCode_key" ON "Attraction"("threeLetterCode");
