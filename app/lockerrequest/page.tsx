"use client";

import { useState } from "react";

export default function LockerRequestPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    const res = await fetch("/lockerrequest/api", {
      method: "POST",
      body: JSON.stringify({
        sNumber: formData.get("sNumber"),
        lockerLocation: formData.get("lockerLocation"),
        lockerRow: formData.get("lockerRow"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return <p>Anfrage gespeichert!</p>;
  }

  return (
    <form action={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-xl font-bold">Schließfach beantragen</h1>

      <input
        name="sNumber"
        type="text"
        placeholder="s-Nummer"
        required
        className="w-full border rounded p-2"
      />

      <select name="lockerLocation" className="w-full border rounded p-2">
        <option value="Lounge">Lounge</option>
        <option value="LZ">LZ</option>
      </select>

      <input
        name="lockerRow"
        type="number"
        placeholder="Reihe"
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Absenden
      </button>
    </form>
  );
}
