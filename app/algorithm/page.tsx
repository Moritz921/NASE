"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export default function AlgorithmTabs() {
  const [htmlPseudo, setHtmlPseudo] = useState("");
  const [htmlTS, setHtmlTS] = useState("");

  const pseudocode = `
Let $n$ be the number of lockers available for all lockers
minus the lockers that are not available ('fobidden' in
'lib/lockerData.json') and $S$ the set of all students that
want a locker.

1. If $|S| > n$ then randomly select a subset of size $n$
   from $S$ and replace $S$ with this subset.
2. Shuffle $S$ randomly.
3. Create four subsets of $S$:
   1. $S_{LR}$: Students that wish to get a locker in a
      specific locker cabinet and on a specific row.
   2. $S_{L}$: Students that wish to get a locker in a
      specific locker cabinet but have no preference for
      a specific row.
   3. $S_{R}$: Students that wish to get a locker on a
      specific row but have no preference for a specific
      locker cabinet.
   4. $S_{N}$: Students that have no preference for a
      specific locker cabinet or row.
4. For each student in $S_{LR}$ in the order of $S_{LR}$:
   1. If there is at least one locker available in the
      specified locker cabinet and row:
      1. Shuffle the available lockers in the specified
         locker cabinet and row randomly.
      2. Assign the first locker in the shuffled list to
         the student and mark it as assigned.
   2. Else:
      1. Remove the row preference of the student and move
         them to $S_{L}$.
   3. Continue with the next student in $S_{LR}$.
5. For each student in $S_{L}$ in the order of $S_{L}$:
   1. If there is at least one locker available in the
      specified cabinet:
      1. Shuffle the available lockers in the specified
         locker cabinet randomly
      2. Assign the first locker in the shuffled list to
         the student and mark it as assigned.
   2. Else:
      1. Remove the locker cabinet preference of the
         student and move them to $S_{N}$.
   3. Continue with the next student in $S_{L}$.
6. For each student in $S_{R}$ in the order of $S_{R}$:
   1. If there is at least one locker available on the
      specified row:
      1. Shuffle the available lockers on the specified
         row randomly.
      2. Assign the first locker in the shuffled list to
         the student and mark it as assigned.
   2. Else:
      1. Remove the row preference of the student and move
         them to $S_{N}$.
   3. Continue with the next student in $S_{R}$.
7. For each student in $S_{N}$ in the order of $S_{N}$:
   1. If there is at least one locker available:
      1. Shuffle the available lockers randomly.
      2. Assign the first locker in the shuffled list to
         the student and mark it as assigned.
   2. Continue with the next student in $S_{N}$.
8. End.
`;

  const tsCode = `
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
  nr_available_lockers += (lockerDataJson.lockers[lockerType]
      .rows
    * lockerDataJson.lockers[lockerType].columns) 
    - lockerDataJson.lockers[lockerType].forbidden.length;
};

// if there are not enough lockers, select random wishes
if (nr_available_lockers < wishes.length) {
  wishes.sort(() => Math.random() - 0.5);
  wishes.splice(nr_available_lockers);
}
wishes.sort(() => Math.random() - 0.5);

// create 4 groups of wishes: with location and row, with
// location only, with row only, with no preference
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

// try to assign the wishes with location and row first
for (const wish of wishes_with_location_and_row) {
  const lockerType = wish.lockerLocation;
  const row = wish.lockerRow;

  // Find lockers matching the location and row, and not
  // already assigned
  const availableLockers = lockers.filter(
    (locker) =>
      locker.location === lockerType &&
      locker.row === row &&
      !locker.assignedWishId
  );

  // Shuffle columns for randomness
  const shuffledLockers = availableLockers.sort(() 
                          => Math.random() - 0.5);

  let assigned = false;
  for (const locker of shuffledLockers) {
    // Check if locker is not excluded (based on lockerDataJson)
    const lockerInfo = lockerDataJson.lockers.find(
      l => l.name === lockerType
    );
    const isExcluded =
      lockerInfo &&
      Array.isArray(lockerInfo.forbidden) &&
      lockerInfo.forbidden.some(
        ([exRow, exCol]) =>
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
    // No available lockers in row for this wish, remove row
    // preference and add to wishes_with_location_only
    wishes_with_location_only.push({
      ...wish,
      lockerRow: null,
    });
  }
}

// then try to assign wishes with location only
  for (const wish of wishes_with_location_only) {
      const lockerType = wish.lockerLocation;
      // Find lockers matching the location, and not
      // already assigned
      const availableLockers = lockers.filter(
          (locker) =>
              locker.location === lockerType &&
              !locker.assignedWishId
      );
      
      // Shuffle columns for randomness
      const shuffledLockers = availableLockers.sort(
        () => Math.random() - 0.5
      );
      let assigned = false;
      for (const locker of shuffledLockers) {
          // Check if locker is not excluded
          // (based on lockerDataJson)
          const lockerInfo = lockerDataJson.lockers.find(
            l => l.name === lockerType
          );
          const isExcluded =
              lockerInfo &&
              Array.isArray(lockerInfo.forbidden) &&
              lockerInfo.forbidden.some(
                                  ([exRow, exCol]) =>
                                    exRow === locker.row
                                    && exCol === locker.col
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
          // No available lockers in location for this wish,
          // remove location preference and add to
          // wishes_with_row_only
          wishes_with_row_only.push({
              ...wish,
              lockerLocation: null,
          });
      }
  }

  // then try to assign wishes with row only
  for (const wish of wishes_with_row_only) {
      const row = wish.lockerRow;
      // Find lockers matching the row, and not
      // already assigned
      const availableLockers = lockers.filter(
          (locker) =>
              locker.row === row &&
              !locker.assignedWishId
      );
      
      // Shuffle columns for randomness
      const shuffledLockers = availableLockers.sort(
        () => Math.random() - 0.5
      );
      let assigned = false;
      for (const locker of shuffledLockers) {
          // Check if locker is not excluded
          // (based on lockerDataJson)
          const lockerInfo = lockerDataJson.lockers.find(
            l => l.name === locker.location
          );
          const isExcluded =
              lockerInfo &&
              Array.isArray(lockerInfo.forbidden) &&
              lockerInfo.forbidden.some(
                                  ([exRow, exCol]) =>
                                    exRow === locker.row
                                    && exCol === locker.col
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
          // No available lockers in row for this wish,
          // remove row preference and add to
          // wishes_with_no_preference
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
      const shuffledLockers = availableLockers.sort(
        () => Math.random() - 0.5
      );
      let assigned = false;
      for (const locker of shuffledLockers) {
          // Check if locker is not excluded
          // (based on lockerDataJson)
          const lockerInfo = lockerDataJson.lockers.find(
            l => l.name === locker.location
          );
          const isExcluded =
              lockerInfo &&
              Array.isArray(lockerInfo.forbidden) &&
              lockerInfo.forbidden.some(
                  ([exRow, exCol]) =>
                      exRow === locker.row
                      && exCol === locker.col
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
          console.log(
            "Could not assign locker to wish id:", wish.id
          );
      }
  }

  console.log("Assignment complete.");
`;

  useEffect(() => {
    (async () => {
      const pseudoHtml = await codeToHtml(pseudocode, { 
        lang: "text",
        themes: {
            light: "catppuccin-latte",
            dark: "catppuccin-frappe"
        } });
      const tsHtml = await codeToHtml(tsCode, {
        lang: "typescript",
        themes: {
            light: "catppuccin-latte",
            dark: "catppuccin-frappe"
        } });

      setHtmlPseudo(pseudoHtml);
      setHtmlTS(tsHtml);
    })();
  }, [pseudocode, tsCode]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Banner */}
      <Image
        className="mb-4 block dark:hidden"
        src="/banner.svg"
        alt="Schließfacheinteilungssystem Banner"
        width={960}
        height={144}
        priority
      />
      <Image
        className="hidden dark:block"
        src="/banner_dark.svg"
        alt="Schließfacheinteilungssystem Banner"
        width={960}
        height={144}
        priority
      />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full sm:max-w-2xl">
        <p>Der Algorithmus ist wie folgt aufgebaut:</p>

        {/* Code Block */}
        <div className="w-full">
            <Tabs>
                <TabList className="flex border-b border-gray-700 space-x-2">
                    <Tab className="px-4 py-2 cursor-pointer">TypeScript</Tab>
                    <Tab disabled className="px-4 py-2 text-gray-400 cursor-not-allowed">
                        Python
                    </Tab>
                    <Tab className="px-4 py-2 cursor-pointer">Pseudocode</Tab>
                </TabList>

                <TabPanel>
                    <div
                        className="rounded-b-xl overflow-x-auto shadow-lg border border-gray-700 w-full max-w-full sm:max-w-2xl p-4"
                        dangerouslySetInnerHTML={{ __html: htmlTS }}
                    />
                </TabPanel>
                <TabPanel>
                    <div className="rounded-b-xl overflow-x-auto shadow-lg border border-gray-700 w-full max-w-full p-4 text-gray-500 italic">
                        Der Python-Code wird derzeit überarbeitet und steht bald zur Verfügung.
                    </div>
                </TabPanel>
                <TabPanel>
                    <div
                        className="rounded-b-xl overflow-x-auto shadow-lg border border-gray-700 w-full max-w-full sm:max-w-2xl p-4"
                        dangerouslySetInnerHTML={{ __html: htmlPseudo }}
                    />
                </TabPanel>
            </Tabs>
            </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/"
        >
          <Image
            className="dark:invert"
            aria-hidden
            src="/home.svg"
            alt="Home Icon"
            width={16}
            height={16}
          />
          Home
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/howto"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          How-To Request
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/algorithm"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Algorithm
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://fs.cs.uni-frankfurt.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to Homepage →
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Moritz921/NASE"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            className="dark:invert"
            src="/github.svg"
            alt="GitHub Icon"
            width={16}
            height={16}
          />
          View source on GitHub →
        </a>
      </footer>
    </div>
  );
}
