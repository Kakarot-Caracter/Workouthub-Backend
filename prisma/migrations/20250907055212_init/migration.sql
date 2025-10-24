/*
  Warnings:

  - You are about to alter the column `weight` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" INTEGER,
    "order" INTEGER,
    "routineId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("createdAt", "description", "id", "name", "order", "reps", "routineId", "sets", "updatedAt", "weight") SELECT "createdAt", "description", "id", "name", "order", "reps", "routineId", "sets", "updatedAt", "weight" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
