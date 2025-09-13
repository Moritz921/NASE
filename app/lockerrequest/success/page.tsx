export default function SuccessPage() {
    const fromMail = process.env.NEXT_PUBLIC_FROM_EMAIL || "fsinf@uni-frankfurt.de (Fallback)";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Dein Schließfach-Antrag wurde angenommen!</h1>
      <p>Du bekommst eine Mail, sobald die Schließfächer zugeordnet wurden.</p>
      <p className="mt-2">Für weitere Fragen wende dich gerne an {fromMail}.</p>
    </div>
  );
}
