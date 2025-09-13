"use client";  // <-- WICHTIG für Interaktivität

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

interface Wish {
  id: number
  sNumber: string
  lockerLocation: string | null
  lockerRow: number | null
  confirmed: boolean
  createdAt: string
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  // Session abrufen
  useEffect(() => {
    async function loadSession() {
        try {
        const res = await fetch("/admin/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        setSession(data);
        } catch (e) {
        console.error("Session fetch failed", e);
        setSession(null);
        }
    }
    loadSession();
    }, []);


  // Wishes laden
  useEffect(() => {
    async function fetchWishes() {
        try {
        const res = await fetch("/admin/api/wishes", { cache: "no-store" });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setWishes(data);
        } catch (e) {
        console.error("Fehler beim Laden der Wishes:", e);
        setWishes([]);
        } finally {
        setLoading(false);
        }
    }
    fetchWishes();
    }, []);

  // Dev-Fallback
  const devUser = { email: "dev@fs.uni-frankfurt.de", name: "Dev User" };
  const user = session?.user ?? (process.env.NODE_ENV === "development" ? devUser : null);

  if (!user) {
    return (
      <div className="p-8">
        <p>Du musst dich zuerst <a href="/admin/api/auth/signin" className="text-blue-600 underline">einloggen</a>.</p>
      </div>
    );
  }

  const handleResend = async (id: number) => {
    await fetch(`/admin/api/wish/${id}/resend`, { method: "POST" });
    alert("Mail erneut verschickt");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Wirklich löschen?")) return;
    await fetch(`/admin/api/wish/${id}/delete`, { method: "DELETE" });
    alert("Eintrag gelöscht. Seite neu laden!");
    setWishes(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Angemeldet als: {user.email}</p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-sm text-green-600 mt-1">Dev-Login aktiv</p>
        )}
      </header>

      {loading ? (
        <p>Lädt...</p>
      ) : (
        <table className="table-auto border border-gray-300 dark:border-gray-700 w-full text-sm">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="border px-2 py-1">S-Nummer</th>
              <th className="border px-2 py-1">Locker</th>
              <th className="border px-2 py-1">Reihe</th>
              <th className="border px-2 py-1">Bestätigt</th>
              <th className="border px-2 py-1">Erstellt</th>
              <th className="border px-2 py-1">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {wishes.map(w => (
              <tr key={w.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                <td className="border px-2 py-1">{w.sNumber}</td>
                <td className="border px-2 py-1">{w.lockerLocation ?? "-"}</td>
                <td className="border px-2 py-1">{w.lockerRow ?? "-"}</td>
                <td className="border px-2 py-1">{w.confirmed ? "Ja" : "Nein"}</td>
                <td className="border px-2 py-1">{new Date(w.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    onClick={() => handleResend(w.id)}
                  >
                    Mail erneut
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    onClick={() => handleDelete(w.id)}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer className="mt-8">
        <a
          href="/admin/api/auth/signout"
          className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </a>
      </footer>
    </div>
  );
}
