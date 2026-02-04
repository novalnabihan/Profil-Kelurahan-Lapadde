/*
  Warnings:

  - The values [PLKB,PENYULUH_PERTANIAN,BABINSA,BHABINKAMTIBMAS] on the enum `OrgUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrgUnit_new" AS ENUM ('LURAH', 'SEKLUR', 'KASI_PEMERINTAHAN', 'KASI_KESEJAHTERAAN', 'KASI_PELAYANAN_UMUM', 'MITRA_EKSTERNAL');
ALTER TABLE "Struktur" ALTER COLUMN "unit" TYPE "OrgUnit_new" USING ("unit"::text::"OrgUnit_new");
ALTER TYPE "OrgUnit" RENAME TO "OrgUnit_old";
ALTER TYPE "OrgUnit_new" RENAME TO "OrgUnit";
DROP TYPE "OrgUnit_old";
COMMIT;
