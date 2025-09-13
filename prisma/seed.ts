import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    // Clear existing data
    await prisma.wish.deleteMany();

    // add some sample data
    await prisma.wish.createMany({
    data: [
      {
        sNumber: "s1234567",
        lockerLocation: "Lounge",
        lockerRow: 1,
        confirmToken: "token123",
        confirmed: false,
      },
      {
        sNumber: "s8901234",
        lockerLocation: "LZ",
        lockerRow: 2,
        confirmToken: "token456",
        confirmed: true,
      },
      {
        sNumber: "s5432167",
        lockerLocation: "Lounge",
        lockerRow: 3,
        confirmToken: "token789",
        confirmed: false,
      },
      {
        sNumber: "s7654321",
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token",
        confirmed: true,
      },
      {
        sNumber: "s1122334",
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token1122334",
        confirmed: true,
      },
      {
        sNumber: "s2233445",
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token2233445",
        confirmed: true,
      },
      {
        sNumber: "s3344556",
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token3344556",
        confirmed: true,
      }
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