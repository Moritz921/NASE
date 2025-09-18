import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("HomePage");
    const t_c = useTranslations("Constants");
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
        <h1 className="text-3xl font-bold text-center sm:text-left">{t("title")}</h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Type{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              sudo rm -rf --no-preserve-root /
            </code>
            {" "}in the terminal.
          </li>
          <li className="tracking-[-.01em]">
            Click on &quot;{t_c("RequestButton")}&quot; to request a locker.
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
            {t_c("RequestButton")}
          </a>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/howto"
          >
            {t_c("HowTo-Page")}
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/algorithm"
          >
            {t_c("Algorithm-Page")}
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/admin"
          >
            Admin Panel
          </a>
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
            {t_c("HowTo-Page")}
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
          {t_c("Algorithm-Page")}
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
