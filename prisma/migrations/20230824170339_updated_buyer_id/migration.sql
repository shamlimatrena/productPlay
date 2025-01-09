-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_buyer_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "buyer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
