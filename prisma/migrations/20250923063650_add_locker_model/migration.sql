-- CreateTable
CREATE TABLE "Locker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sNumber" TEXT NOT NULL,
    "lockerLocation" TEXT,
    "lockerRow" INTEGER,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "assignedLockerId" INTEGER,
    CONSTRAINT "Wish_assignedLockerId_fkey" FOREIGN KEY ("assignedLockerId") REFERENCES "Locker" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Wish" ("confirmToken", "confirmed", "createdAt", "id", "lockerLocation", "lockerRow", "sNumber") SELECT "confirmToken", "confirmed", "createdAt", "id", "lockerLocation", "lockerRow", "sNumber" FROM "Wish";
DROP TABLE "Wish";
ALTER TABLE "new_Wish" RENAME TO "Wish";
CREATE UNIQUE INDEX "Wish_confirmToken_key" ON "Wish"("confirmToken");
CREATE UNIQUE INDEX "Wish_assignedLockerId_key" ON "Wish"("assignedLockerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
