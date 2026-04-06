import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const existingProducts = await prisma.product.count();

  if (existingProducts > 0) {
    console.log(
      `Insercion cancelada ya hay registros en DB`,
    );
    return;
  }

  console.log('Insertando registros iniciales');

  const sqlPath = path.join(__dirname, 'data.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  await prisma.$executeRawUnsafe(sql);

  const total = await prisma.product.count();
  console.log(`Registros insertados: ${total}`);
}

main()
  .catch((error) => {
    console.error('Error durante el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
