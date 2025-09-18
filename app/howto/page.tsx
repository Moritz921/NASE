import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
        <h1 className="text-2xl font-bold text-center sm:text-left">
            How to beantragen eines Schließfachs
        </h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
                Klicke auf &quot;Schließfach beantragen&quot; um ein Schließfach zu beantragen.
            </li>
            <li className="mb-2 tracking-[-.01em]">
                Gib deine s-Nummer ein (ohne &quot;s&quot;) und optional deinen Wunschstandort und deine Wunschreihe.
            </li>
            <li className="mb-2 tracking-[-.01em]">
                Klicke auf &quot;Anfrage senden&quot;. Du erhältst eine E-Mail an deine stud.uni-frankfurt.de-Adresse.
            </li>
            <li className="mb-2 tracking-[-.01em]">
                Öffne die E-Mail und klicke auf den Bestätigungslink, um deine Anfrage zu bestätigen.
            </li>
            <li className="tracking-[-.01em]">
                Warte auf die Zuteilung deines Schließfachs. Du wirst per E-Mail benachrichtigt, sobald dir ein Schließfach
                zugewiesen wurde. Wie du Zugriff auf dein Schließfach erhältst, erfährst du in der E-Mail.
            </li>
            <li className="mt-2 tracking-[-.01em]">
                Am Ende des Semesters musst du dein Schließfach räumen. Weitere Informationen dazu findest du in der E-Mail.
            </li>
        </ol>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-bold text-bold sm:text-base h-10 sm:h-24 px-4 sm:px-39 sm:w-auto"
                href="/lockerrequest"
            >
                <Image
                    className="dark:invert"
                    src="/fsinf_inverted.png"
                    alt="FS Inf logo"
                    width={20}
                    height={20}
                />
                Schließfach beantragen
            </a>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/algorithm"
            >
                Algorithmus ansehen
            </a>
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
