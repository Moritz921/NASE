-- CreateTable
CREATE TABLE "Wish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sNumber" TEXT NOT NULL,
    "lockerLocation" TEXT,
    "lockerRow" INTEGER,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Wish_confirmToken_key" ON "Wish"("confirmToken");
