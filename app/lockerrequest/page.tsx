"use client";

import { useState, useEffect } from "react";
import LockerGrid from "./LockerGrid"; // import the LockerGrid component

type LockerData = {
  forbidden: [number, number][];
};

export default function LockerRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<[number, number] | null>(null);
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
    return <p className="text-center mt-8 text-green-600">Anfrage gespeichert!</p>;
  }

  return (
    <form
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

      <p>Schrank auswählen (optional):</p>
      <LockerGrid
        rows={5}
        cols={6}
        forbidden={lockerData.forbidden}
        onSelect={(r, c) => setSelectedLocker([r, c])}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        // disabled={!formHasSNumber(selectedLocker)}
      >
        Submit
      </button>
    </form>
  );
}

// // Helper function to control button activation
// function formHasSNumber(selectedLocker: [number, number] | null) {
//   // We only activate if a locker is selected or s-number is entered
//   // The form submit checks sNumber anyway
//   return true;
// }
