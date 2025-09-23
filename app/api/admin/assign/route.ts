import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import lockerDataJson from "@/lib/lockerData.json";

export async function POST() {
  // select each wish that is not assigned yet
  const wishes = await prisma.wish.findMany({
    orderBy: { createdAt: "asc" },
  });

  // get all free lockers
  const lockers = await prisma.locker.findMany({
      where: { wish: null },
      orderBy: [{ row: "asc" }, { col: "asc" }],
    });
    

  let nr_available_lockers = 0;
  for (const lockerType in lockerDataJson.lockers) {
    console.log("Processing locker type:", lockerDataJson.lockers[lockerType].name);
    console.log("Rows:", lockerDataJson.lockers[lockerType].rows);
    console.log("Columns:", lockerDataJson.lockers[lockerType].columns);
    console.log("Forbidden:", lockerDataJson.lockers[lockerType].forbidden);
    nr_available_lockers += (lockerDataJson.lockers[lockerType].rows * lockerDataJson.lockers[lockerType].columns) - lockerDataJson.lockers[lockerType].forbidden.length;
  };

  console.log("Total wishes before assignment:", wishes.length);
  console.log("Total available lockers:", nr_available_lockers);

  // if there are not enough lockers, select random wishes
  if (nr_available_lockers < wishes.length) {
    wishes.sort(() => Math.random() - 0.5);
    wishes.splice(nr_available_lockers);
  }
  wishes.sort(() => Math.random() - 0.5);

  // create 4 groups of wishes: with location and row, with location only, with row only, with no preference
  const wishes_with_location_and_row = wishes.filter(
    (wish) => wish.lockerLocation && wish.lockerRow
  );
  const wishes_with_location_only = wishes.filter(
    (wish) => wish.lockerLocation && !wish.lockerRow
  );
  const wishes_with_row_only = wishes.filter(
    (wish) => !wish.lockerLocation && wish.lockerRow
  );
  const wishes_with_no_preference = wishes.filter(
    (wish) => !wish.lockerLocation && !wish.lockerRow
  );

  console.log("Total wishes to assign:", wishes.length);
  console.log("Wishes with location and row:", wishes_with_location_and_row.length);
  console.log("Wishes with location only:", wishes_with_location_only.length);
  console.log("Wishes with row only:", wishes_with_row_only.length);
  console.log("Wishes with no preference:", wishes_with_no_preference.length);

  // try to assign the wishes with location and row first
  for (const wish of wishes_with_location_and_row) {
    const lockerType = wish.lockerLocation;
    const row = wish.lockerRow;

    // Find lockers matching the location and row, and not already assigned
    const availableLockers = lockers.filter(
      (locker) =>
        locker.location === lockerType &&
        locker.row === row &&
        !locker.assignedWishId
    );

    // Shuffle columns for randomness
    const shuffledLockers = availableLockers.sort(() => Math.random() - 0.5);

    let assigned = false;
    for (const locker of shuffledLockers) {
      // Check if locker is not excluded (based on lockerDataJson)
      const lockerInfo = (lockerDataJson as any)[lockerType];
      const isExcluded =
        lockerInfo &&
        Array.isArray(lockerInfo.excluded) &&
        lockerInfo.excluded.some(
          ([exRow, exCol]: [number, number]) =>
           exRow === locker.row && exCol === locker.col
        );

      if (!isExcluded) {
        // Assign locker to wish
        await prisma.wish.update({
          where: { id: wish.id },
          data: { assignedLockerId: locker.id },
        });
        // Mark locker as assigned
        locker.assignedWishId = wish.id;
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      // No available lockers in row for this wish, remove row preference and add to wishes_with_location_only
      wishes_with_location_only.push({
        ...wish,
        lockerRow: null,
      });
    }
  }

  // then try to assign wishes with location only
    for (const wish of wishes_with_location_only) {
        const lockerType = wish.lockerLocation;
        // Find lockers matching the location, and not already assigned
        const availableLockers = lockers.filter(
            (locker) =>
                locker.location === lockerType &&
                !locker.assignedWishId
        );
        
        // Shuffle columns for randomness
        const shuffledLockers = availableLockers.sort(() => Math.random() - 0.5);
        let assigned = false;
        for (const locker of shuffledLockers) {
            // Check if locker is not excluded (based on lockerDataJson)
            const lockerInfo = (lockerDataJson as any)[lockerType];
            const isExcluded =
                lockerInfo &&
                Array.isArray(lockerInfo.excluded) &&
                lockerInfo.excluded.some(
                    ([exRow, exCol]: [number, number]) =>
                        exRow === locker.row && exCol === locker.col
                );
            if (!isExcluded) {
                // Assign locker to wish
                await prisma.wish.update({
                    where: { id: wish.id },
                    data: { assignedLockerId: locker.id },
                });
                // Mark locker as assigned
                locker.assignedWishId = wish.id;
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            // No available lockers in location for this wish, remove location preference and add to wishes_with_row_only
            wishes_with_row_only.push({
                ...wish,
                lockerLocation: null,
            });
        }
    }

    // then try to assign wishes with row only
    for (const wish of wishes_with_row_only) {
        const row = wish.lockerRow;
        // Find lockers matching the row, and not already assigned
        const availableLockers = lockers.filter(
            (locker) =>
                locker.row === row &&
                !locker.assignedWishId
        );
        
        // Shuffle columns for randomness
        const shuffledLockers = availableLockers.sort(() => Math.random() - 0.5);
        let assigned = false;
        for (const locker of shuffledLockers) {
            // Check if locker is not excluded (based on lockerDataJson)
            const lockerInfo = (lockerDataJson as any)[locker.location];
            const isExcluded =
                lockerInfo &&
                Array.isArray(lockerInfo.excluded) &&
                lockerInfo.excluded.some(
                    ([exRow, exCol]: [number, number]) =>
                        exRow === locker.row && exCol === locker.col
                );
            if (!isExcluded) {
                // Assign locker to wish
                await prisma.wish.update({
                    where: { id: wish.id },
                    data: { assignedLockerId: locker.id },
                });
                // Mark locker as assigned
                locker.assignedWishId = wish.id;
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            // No available lockers in row for this wish, remove row preference and add to wishes_with_no_preference
            wishes_with_no_preference.push({
                ...wish,
                lockerRow: null,
            });
        }
    }

    // then try to assign wishes with no preference
    for (const wish of wishes_with_no_preference) {
        // Find any available lockers not already assigned
        const availableLockers = lockers.filter(
            (locker) =>
                !locker.assignedWishId
        );
        
        // Shuffle columns for randomness
        const shuffledLockers = availableLockers.sort(() => Math.random() - 0.5);
        let assigned = false;
        for (const locker of shuffledLockers) {
            // Check if locker is not excluded (based on lockerDataJson)
            const lockerInfo = (lockerDataJson as any)[locker.location];
            const isExcluded =
                lockerInfo &&
                Array.isArray(lockerInfo.excluded) &&
                lockerInfo.excluded.some(
                    ([exRow, exCol]: [number, number]) =>
                        exRow === locker.row && exCol === locker.col
                );
            if (!isExcluded) {
                // Assign locker to wish
                await prisma.wish.update({
                    where: { id: wish.id },
                    data: { assignedLockerId: locker.id },
                });
                // Mark locker as assigned
                locker.assignedWishId = wish.id;
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            console.log("Could not assign locker to wish id:", wish.id);
        }
    }

    console.log("Assignment complete.");

  // TODO: better assignment algorithm, see: proof_of_concept.py
  // assign lockers to wishes
//   for (let i = 0; i < wishes.length; i++) {
//     await prisma.wish.update({
//       where: { id: wishes[i].id },
//       data: { assignedLockerId: lockers[i].id },
//     });
//   }

  return NextResponse.json({ success: true });
}
