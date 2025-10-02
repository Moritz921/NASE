# NASE - nicht-automatisches Schließfach-Einteilungs-System

This project is based on the Gruppeneinteilungssystem auge from the Goethe University Frankfurt. It's goal is to provide a simple web application for the allocation of lockers to students in a fair and efficient manner.

## Getting Started

To start the development server, run the following command in the project directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing and Linting

The tests need to run successfully before a pull request can be merged! If you want to contribute to this project, please make sure to add tests for your changes. To run the tests, use:

```bash
npm test
```

To run the linter, use: 

```bash
npm run lint
```

## Algorithm

The algorithm for assigning the lockers is implemented in `app/admin/api/assign/route.ts`. A brief overview of the algorithm is as follows:

Let $n$ be the number of lockers available for all lockers minus the lockers that are not available (`fobidden` in `lib/lockerData.json`) and $S$ the set of all students that want a locker.

1. If $|S| > n$ then randomly select a subset of size $n$ from $S$ and replace $S$ with this subset.
2. Shuffle $S$ randomly.
3. Create four subsets of $S$:
   1. $S_{LR}$: Students that wish to get a locker in a specific locker cabinet and on a specific row.
   2. $S_{L}$: Students that wish to get a locker in a specific locker cabinat but have no preference for a specific row.
   3. $S_{R}$: Students that wish to get a locker on a specific row but have no preference for a specific locker cabinet.
   4. $S_{N}$: Students that have no preference for a specific locker cabinet or row.
4. For each student in $S_{LR}$ in the order of $S_{LR}$:
   1. If there is at least one locker available in the specified locker cabinet and row:
      1. Shuffle the available lockers in the specified locker cabinet and row randomly.
      2. Assign the first locker in the shuffled list to the student and mark it as assigned.
   2. Else:
      1. Remove the row preference of the student and move them to $S_{L}$.
   3. Continue with the next student in $S_{LR}$.
5. For each student in $S_{L}$ in the order of $S_{L}$:
   1. If there is at least one locker available in the specified cabinet:
      1. Shuffle the available lockers in the specified locker cabinet randomly.
      2. Assign the first locker in the shuffled list to the student and mark it as assigned.
   2. Else:
      1. Remove the locker cabinet preference of the student and move them to $S_{N}$.
   3. Continue with the next student in $S_{L}$.
6. For each student in $S_{R}$ in the order of $S_{R}$:
   1. If there is at least one locker available on the specified row:
      1. Shuffle the available lockers on the specified row randomly.
      2. Assign the first locker in the shuffled list to the student and mark it as assigned.
   2. Else:
      1. Remove the row preference of the student and move them to $S_{N}$.
   3. Continue with the next student in $S_{R}$.
7. For each student in $S_{N}$ in the order of $S_{N}$:
   1. If there is at least one locker available:
      1. Shuffle the available lockers randomly.
      2. Assign the first locker in the shuffled list to the student and mark it as assigned.
   2. Continue with the next student in $S_{N}$.
8. End.
