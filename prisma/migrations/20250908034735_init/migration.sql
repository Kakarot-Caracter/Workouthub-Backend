/*
  Warnings:

  - You are about to drop the column `description` on the `Exercise` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" INTEGER,
    "order" INTEGER,
    "routineId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("createdAt", "id", "name", "order", "reps", "routineId", "sets", "updatedAt", "weight") SELECT "createdAt", "id", "name", "order", "reps", "routineId", "sets", "updatedAt", "weight" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
