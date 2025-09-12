import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    // Clear existing data
    await prisma.wish.deleteMany();

    // add some sample data
    await prisma.wish.createMany({
    data: [
      {
        sNumber: "s12345",
        lockerLocation: "Lounge",
        lockerRow: 1,
        confirmToken: "token123",
        confirmed: false,
      },
      {
        sNumber: "s67890",
        lockerLocation: "LZ",
        lockerRow: 2,
        confirmToken: "token456",
        confirmed: true,
      },
      {
        sNumber: "s54321",
        lockerLocation: "Lounge",
        lockerRow: 3,
        confirmToken: "token789",
        confirmed: false,
      },
    ],
  })

    console.log("Database has been seeded.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect();
        process.exit(1)
    })