const  { PrismaClient } = require('@prisma/client');

const  { v4: uuidv4 } = require('uuid');


 const generateUniqueId = async (prefix, length) => {
  let uuid = uuidv4().replace(/-/g, "");
  let uuidLength = length - prefix.length;
  let trimmedUuid = uuid.substring(0, uuidLength);
  return (prefix + trimmedUuid).toUpperCase();
};

const prisma = new PrismaClient();

async function updateCurrencyIds() {
  const currencies = await prisma.currencies.findMany();

  for (const currency of currencies) {
    await prisma.currencies.update({
      where: { id: currency.id },
      data: { currency_id: generateUniqueId(currency.symbol, 15) },
    });
  }

  await prisma.$disconnect();
}

updateCurrencyIds().catch(console.error);