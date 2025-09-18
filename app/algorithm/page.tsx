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
Algorithm AssignLockers(requests)
    assigned_lockers ← ∅
    for each request in requests do
        assign a free locker
        add to assigned_lockers
    return assigned_lockers
`;

  const tsCode = `
function assignLockers(requests: Request[]): LockerAssignment[] {
    const assignedLockers: LockerAssignment[] = [];

    for (const req of requests) {
        const locker = findFreeLocker();
        assignedLockers.push(locker);
    }

    return assignedLockers;
}
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

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-3xl">
        <p>Der Algorithmus ist <strong>nicht</strong> wie folgt aufgebaut:</p>

        {/* Code Block */}
        <div className="w-full max-w-2xl">
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
                        className="rounded-b-xl overflow-x-auto shadow-lg border border-gray-700 w-full max-w-full sm:max-w-3xl p-4"
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
                        className="rounded-b-xl overflow-x-auto shadow-lg border border-gray-700 w-full max-w-full sm:max-w-3xl p-4"
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
