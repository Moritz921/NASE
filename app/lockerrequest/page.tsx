"use client";

import { useState, useEffect } from "react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import LockerGrid from "./LockerGrid"; // import the LockerGrid component

type LockerData = {
  forbidden: [number, number][];
};

export default function LockerRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedLocker] = useState<[number, number] | null>(null);
  const [lockerData, setLockerData] = useState<LockerData>({ forbidden: [] });

  // load locker data from JSON file
  useEffect(() => {
    fetch("/lockerData.json")
      .then((res) => res.json())
      .then((data) => setLockerData(data))
      .catch(() => console.warn("Error loading locker data"));
  }, []);

  async function handleSubmit(formData: FormData) {
    // const lockerRow = formData.get("lockerRow")?.toString() || null;
    const lockerLocation = formData.get("lockerLocation")?.toString() || null;

    const body: {
      sNumber: FormDataEntryValue | null;
      lockerLocation?: string;
      lockerRow?: number;
    } = {
      sNumber: formData.get("sNumber"),
    };
    if (lockerLocation) body.lockerLocation = lockerLocation;
    if (selectedLocker) body.lockerRow = selectedLocker[0]; // optional: send row only

    const res = await fetch("/lockerrequest/api", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
              <h1 className="text-xl font-bold">Antrag eingereicht</h1>
              <p>
                Dein Antrag wurde aufgenommen. Um ihn zu bestätigen, klicke bitte auf den
                Link in der <strong>Bestätigungs-E-Mail</strong>, die wir dir gerade geschickt haben.
                Falls du keine E-Mail erhältst, überprüfe bitte auch deinen Spam-Ordner.
                <br />
                <br />
                Falls du Fragen hast, melde dich gerne bei uns unter{" "}
                <a
                  href="mailto:fsinf@uni-frankfurt.de"
                  className="text-blue-600 hover:underline"
                >
                  fsinf@uni-frankfurt.de
                </a>
              </p>
            </div>
          </main>
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
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
          </footer>
        </div>
    );
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <Form
              action={handleSubmit}
              className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
            >
              <h1 className="text-xl font-bold">Schließfach beantragen</h1>

              <input
                name="sNumber"
                type="text"
                placeholder="s-Nummer"
                required
                className="w-full border rounded p-2"
              />

              <select name="lockerLocation" className="w-full border rounded p-2">
                <option value="">-- Ort auswählen (optional) --</option>
                <option value="Lounge">Lounge</option>
                <option value="LZ">LZ</option>
              </select>

              <input
                name="row"
                type="number"
                placeholder="Reihe (optional)"
                min={1}
                max={5}
                className="w-full border rounded p-2"
              />

              <p>Schrank auswählen (optional):</p>
              <LockerGrid
                rows={5}
                cols={6}
                forbidden={lockerData.forbidden}
              />
              <LockerGrid
                rows={4}
                cols={6}
                forbidden={lockerData.forbidden}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                // disabled={!formHasSNumber(selectedLocker)}
              >
                Submit
              </button>
            </Form>
          </main>
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

// // Helper function to control button activation
// function formHasSNumber(selectedLocker: [number, number] | null) {
//   // We only activate if a locker is selected or s-number is entered
//   // The form submit checks sNumber anyway
//   return true;
// }
