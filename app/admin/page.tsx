"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Wish {
  id: number;
  sNumber: string;
  lockerLocation: string | null;
  lockerRow: number | null;
  confirmed: boolean;
  createdAt: string;
  published: boolean;
  assignedLocker?: Locker | null;
}

interface Locker {
  id: number;
  location: string;
  row: number;
  col: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  // Wishes laden
  useEffect(() => {
    async function fetchWishes() {
      try {
        const res = await fetch("/api/wishes", { cache: "no-store" });
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
    if (session?.user) {
      fetchWishes();
    }
  }, [session]);

  // Status prüfen
  if (status === "loading") {
    return <p className="p-8">Session wird geladen...</p>;
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Willkommen im Admin-Bereich
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Bitte melde dich über Authentik an
          </p>
          <button
            onClick={() => signIn("authentik", { callbackUrl: "/admin" })}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zM10.5 17l-4.5-5.25L10.5 6h3v4.5h3V6h3l-4.5 5.25L16.5 17h-3v-4.5h-3V17h-3z"/>
            </svg>
            Mit Authentik anmelden
          </button>
        </div>
      </div>
    );
  }

  const handleResend = async (id: number) => {
    await fetch(`/api/wish/${id}/resend`, { method: "POST" });
    alert("Mail erneut verschickt");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Wirklich löschen?")) return;
    await fetch(`/api/wish/${id}/delete`, { method: "DELETE" });
    alert("Eintrag gelöscht. Seite neu laden!");
    setWishes((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Angemeldet als: {session.user.email} <br />
          (Gruppen: {session.user.groups?.join(", ") || "keine"})
        </p>
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
              <th className="border px-2 py-1">Zuweisung</th>
            </tr>
          </thead>
          <tbody>
            {wishes.map((w) => (
              <tr
                key={w.id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                <td className="border px-2 py-1">{w.sNumber}</td>
                <td className="border px-2 py-1">{w.lockerLocation ?? "-"}</td>
                <td className="border px-2 py-1">{w.lockerRow ?? "-"}</td>
                <td className="border px-2 py-1">
                  {w.confirmed ? "Ja" : "Nein"}
                </td>
                <td className="border px-2 py-1">
                  {new Date(w.createdAt).toLocaleString()}
                </td>
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
                <td className="border px-2 py-1">
                  {w.assignedLocker
                    ? `${w.assignedLocker.location} R${w.assignedLocker.row}C${w.assignedLocker.col}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={async () => {
            if (!confirm("Alle Wishes jetzt automatisch zuordnen?")) return;
            const res = await fetch("/api/admin/assign", { method: "POST" });
            if (res.ok) {
              alert("Zuteilung erfolgreich!");
              location.reload();
            } else {
              const data = await res.json();
              alert("Fehler: " + (data.error || "Unbekannt"));
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Zuteilen
        </button>

        <button
          onClick={async () => {
            if (!confirm("Alle Zuweisungen zurücksetzen?")) return;
            const res = await fetch("/api/admin/reset-assignments", { method: "POST" });
            if (res.ok) {
              alert("Alle Zuweisungen zurückgesetzt!");
              location.reload();
            } else {
              alert("Fehler beim Zurücksetzen");
            }
          }}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Zurücksetzen
        </button>

        {/* Check if lockers are assigned and display a send Mails button */}
        {wishes.some(w => w.assignedLocker) && (
          <button
            onClick={async () => {
              if (!confirm("Mails an alle senden?")) return;
              const res = await fetch("/api/admin/send-assignment-mails", { method: "POST" });
              if (res.ok) {
                alert("Mails wurden gesendet!");
              } else {
                alert("Fehler beim Senden der Mails");
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Mails senden
          </button>
        )}
      </div>

      {/* Visualization */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Schließfach-Übersicht</h2>

        <div className="flex flex-col gap-6">
          {Object.entries(
            wishes.reduce((acc, w) => {
              // group by location
              const loc = w.assignedLocker?.location ?? "Unknown";
              if (!acc[loc]) acc[loc] = [];
              acc[loc].push(w);
              return acc;
            }, {} as Record<string, typeof wishes>)
          ).map(([location, lockers]) => {
            // calc max row/col
            const maxRow = Math.max(...lockers.map(l => l.assignedLocker?.row ?? 0));
            const maxCol = Math.max(...lockers.map(l => l.assignedLocker?.col ?? 0));

            // 2D-Array for grid
            const grid: (typeof lockers[0] | null)[][] = Array.from(
              { length: maxRow },
              () => Array(maxCol).fill(null)
            );
            lockers.forEach(l => {
              if (l.assignedLocker) {
                grid[l.assignedLocker.row - 1][l.assignedLocker.col - 1] = l;
              }
            });

            return (
              <div key={location}>
                <h3 className="text-lg font-semibold mb-2">{location}</h3>
                <div className="inline-block border border-gray-400 dark:border-gray-600 p-2 bg-white dark:bg-gray-800">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${maxCol}, 6rem)` // jede Spalte 6rem breit
                    }}
                  >
                    {Array.from({ length: maxRow }).map((_, rIdx) =>
                      Array.from({ length: maxCol }).map((_, cIdx) => {
                        const rowIndex = maxRow - rIdx; // statt rIdx+1 von oben → jetzt von unten
                        const colIndex = cIdx + 1;

                        const locker = lockers.find(
                          (l) => l.assignedLocker?.row === rowIndex && l.assignedLocker?.col === colIndex
                        );

                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`h-12 flex items-center justify-center border border-gray-300 dark:border-gray-700
                              ${locker ? "bg-green-200 dark:bg-green-700" : "bg-gray-100 dark:bg-gray-900"}
                            `}
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {locker ? locker.sNumber : "-"}
                            </span>
                          </div>
                        );
                      })
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      <footer className="mt-8">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </footer>
    </div>
  );
}
