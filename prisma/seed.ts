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
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token123",
        confirmed: false,
      },
      {
        sNumber: "s8901234",
        lockerLocation: "Lounge",
        confirmToken: "token456",
        confirmed: true,
      },
      {
        sNumber: "s5432167",
        lockerRow: 2,
        confirmToken: "token789",
        confirmed: false,
      },
      {
        sNumber: "s7654321",
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
      },
      {
        sNumber: "s4455667",
        lockerLocation: "LZ",
        lockerRow: 2,
        confirmToken: "token4455667",
        confirmed: false,
      },
      {
        sNumber: "s5566778",
        lockerLocation: "Lounge",
        lockerRow: 3,
        confirmToken: "token5566778",
        confirmed: true,
      },
      {
        sNumber: "s6677889",
        lockerLocation: "LZ",
        lockerRow: 4,
        confirmToken: "token6677889",
        confirmed: false,
      },
      {
        sNumber: "s7788990",
        lockerLocation: "Lounge",
        lockerRow: 2,
        confirmToken: "token7788990",
        confirmed: true,
      },
      {
        sNumber: "s8899001",
        lockerLocation: "LZ",
        lockerRow: 3,
        confirmToken: "token8899001",
        confirmed: false,
      },
      {
        sNumber: "s9900112",
        lockerLocation: "Lounge",
        lockerRow: 1,
        confirmToken: "token9900112",
        confirmed: true,
      },
      {
        sNumber: "s1011122",
        lockerLocation: "LZ",
        lockerRow: 2,
        confirmToken: "token1011122",
        confirmed: true,
      },
      {
        sNumber: "s1213141",
        lockerLocation: "Lounge",
        lockerRow: 4,
        confirmToken: "token1213141",
        confirmed: false,
      },
      {
        sNumber: "s1314151",
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token1314151",
        confirmed: true,
      },
      {
        sNumber: "s1415161",
        lockerLocation: "Lounge",
        lockerRow: 3,
        confirmToken: "token1415161",
        confirmed: false,
      },
      {
        sNumber: "s1516171",
        lockerLocation: "LZ",
        lockerRow: 4,
        confirmToken: "token1516171",
        confirmed: true,
      },
      {
        sNumber: "s1617181",
        lockerLocation: "Lounge",
        lockerRow: 2,
        confirmToken: "token1617181",
        confirmed: false,
      },
      {
        sNumber: "s1718191",
        lockerLocation: "LZ",
        lockerRow: 3,
        confirmToken: "token1718191",
        confirmed: true,
      },
      {
        sNumber: "s1819201",
        lockerLocation: "Lounge",
        lockerRow: 1,
        confirmToken: "token1819201",
        confirmed: false,
      },
      {
        sNumber: "s1920211",
        lockerLocation: "LZ",
        lockerRow: 2,
        confirmToken: "token1920211",
        confirmed: true,
      },
      {
        sNumber: "s2021221",
        lockerLocation: "Lounge",
        lockerRow: 4,
        confirmToken: "token2021221",
        confirmed: false,
      },
      {
        sNumber: "s2122231",
        lockerLocation: "LZ",
        lockerRow: 1,
        confirmToken: "token2122231",
        confirmed: true,
      },
      {
        sNumber: "s2223241",
        lockerLocation: "Lounge",
        lockerRow: 3,
        confirmToken: "token2223241",
        confirmed: false,
      },
      {
        sNumber: "s2324251",
        lockerLocation: "LZ",
        lockerRow: 4,
        confirmToken: "token2324251",
        confirmed: true,
      },
      {
        sNumber: "s2425261",
        lockerLocation: "Lounge",
        lockerRow: 2,
        confirmToken: "token2425261",
        confirmed: false,
      },
      {
        sNumber: "s2526271",
        lockerLocation: "LZ",
        lockerRow: 2,
        confirmToken: "token2526271",
        confirmed: true,
      },
      {
        sNumber: "s2627281",
        lockerLocation: "Lounge",
        lockerRow: 1,
        confirmToken: "token2627281",
        confirmed: false,
      },
    ],
  });

  await prisma.locker.deleteMany();

  const lockers: any[] = [];
  for (let row = 1; row <= 4; row++) {
    for (let col = 1; col <= 4; col++) {
      lockers.push({ location: "Lounge", row, col });
    }
  }
  const lockersLZ: any[] = [];
  for (let row = 1; row <= 4; row++) {
    for (let col = 1; col <= 3; col++) {
      lockersLZ.push({ location: "LZ", row, col });
    }
  }

  await prisma.locker.createMany({ data: [...lockers, ...lockersLZ] });

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