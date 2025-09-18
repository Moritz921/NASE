import { useTranslations } from "next-intl";

export default function SuccessPage() {
    const fromMail = process.env.NEXT_PUBLIC_FROM_EMAIL || "fsinf@uni-frankfurt.de (Fallback)";
    const t = useTranslations("SucessfulRequstPage");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <p>{t("text1")}</p>
      <p className="mt-2">{t("text2")} {fromMail}.</p>
    </div>
  );
}
