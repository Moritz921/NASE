import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTransporter } from "@/lib/mailer";

export async function POST() {
  try {
    const transporter = getTransporter();
    const isDev = process.env.NODE_ENV !== "production";

    // Wünsche mit Fach
    const assignedWishes = await prisma.wish.findMany({
      where: { assignedLockerId: { not: null } },
      include: { assignedLocker: true },
    });

    // Wünsche ohne Fach
    const unassignedWishes = await prisma.wish.findMany({
      where: { assignedLockerId: null },
    });

    // Mails an alle mit Zuweisung
    const assignedMails = assignedWishes.map(async (wish) => {
      if (!wish.assignedLocker) return;

      const lockerLabel = `${wish.assignedLocker.location} R${wish.assignedLocker.row}C${wish.assignedLocker.col}`;

      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: `${wish.sNumber}@stud.uni-frankfurt.de`,
        subject: "Deine Schließfach-Zuweisung",
        text: `Hallo ${wish.sNumber},\n\ndu hast das Schließfach ${lockerLabel} zugewiesen bekommen.\n\nDen Schlüssel kannst du in der Lounge bei einem Fachschaftler abholen.\n\nDenk daran, dass du bis spätestens zum Beginn des nächsten Semesters das Fach leerst und den Schlüssel zurückgibst. Vielen Dank!\n\nViele Grüße\ndeine Fachschaft Informatik`,
        html: `<p>Hallo ${wish.sNumber},</p>
               <p>du hast das Schließfach <strong>${lockerLabel}</strong> zugewiesen bekommen.</p>
               <p>Den Schlüssel kannst du in der Lounge bei einem Fachschaftler abholen.</p>
               <p>Denk daran, dass du bis spätestens zum Beginn des nächsten Semesters das Fach leerst und den Schlüssel zurückgibst. Vielen Dank!</p>
               <p>Viele Grüße<br/>deine Fachschaft Informatik</p>`,
        };

      const info = await transporter.sendMail(mailOptions);

      if (isDev) {
        console.log(`[DEV-MAIL] To: ${mailOptions.to}, Subject: ${mailOptions.subject}`);
        console.log("==== Mail Preview ====");
        console.log(info.message.toString());
        console.log("======================");
      }
    });

    // Mails an alle ohne Zuweisung
    const unassignedMails = unassignedWishes.map(async (wish) => {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: `${wish.sNumber}@stud.uni-frankfurt.de`,
        subject: "Leider keine Schließfach-Zuweisung",
        text: `Hallo ${wish.sNumber},\n\nleider konnten wir dir in dieser Runde kein Schließfach zuteilen.`,
        html: `<p>Hallo ${wish.sNumber},</p>
               <p>leider konnten wir dir in dieser Runde <strong>kein Schließfach</strong> zuteilen.</p>`,
      };

      const info = await transporter.sendMail(mailOptions);

      if (isDev) {
        console.log(`[DEV-MAIL] To: ${mailOptions.to}, Subject: ${mailOptions.subject}`);
        console.log("==== Mail Preview ====");
        console.log(info.message.toString());
        console.log("======================");
      }
    });

    await Promise.all([...assignedMails, ...unassignedMails]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Fehler beim Senden der Mails", err);
    return NextResponse.json({ error: "Fehler beim Senden" }, { status: 500 });
  }
}
