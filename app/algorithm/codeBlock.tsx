"use_client";
import { getHighlighter } from "shiki";
import { useEffect, useState } from "react";

export default function CodeBlock({ code, language }: { code: string; language: string }) {
    const [html, setHtml] = useState<string>("");

    useEffect(() => {
        getHighlighter({ theme: "nord" }).then((highlighter) => {
            setHtml(highlighter.codeToHtml(code, { lang: language }));
        });
    }, [code, language]);

    return (
        <div
            className="rounded-lg shadow bg-gray-900 p-4 text-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}