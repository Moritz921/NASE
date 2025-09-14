import { prisma } from "@/lib/prisma";
import { getTransporter } from "@/lib/mailer";
import { randomBytes } from "crypto";
import qp from "quoted-printable";

export async function handleLockerRequest(body: {
  sNumber?: string;
  lockerLocation?: string;
  lockerRow?: number;
}) {
  const { sNumber, lockerLocation, lockerRow } = body;

  if (!sNumber) {
    return { status: 400, data: { error: "sNumber required" } };
  }

  const token = randomBytes(32).toString("hex");

  await prisma.wish.create({
    data: {
      sNumber,
      lockerLocation: lockerLocation || null,
      lockerRow: lockerRow ? Number(lockerRow) : null,
      confirmToken: token,
    },
  });

  const confirmUrl = `${process.env.BASE_URL}/lockerrequest/confirm?token=${token}`;
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: `"Schliessfach-System FS Informatik" <${process.env.NEXT_PUBLIC_FROM_EMAIL}>`,
    to: `${sNumber}@stud.uni-frankfurt.de`,
    subject: "Bitte Schließfach-Anfrage bestätigen",
    text: `Hallo ${sNumber},\n\nbitte bestätige deine Schließfach-Anfrage durch Klicken auf den folgenden Link:\n\n${confirmUrl}\n\nFalls du kein Schließfach beantragt hast, kannst du diese E-Mail ignorieren.\n\nViele Grüße\nDeine Fachschaft Informatik`,
    html: `<p>Hallo ${sNumber},</p><p>bitte bestätige deine Schließfach-Anfrage durch Klicken auf den folgenden Link:</p><p><a href="${confirmUrl}">Schließfach-Anfrage bestätigen</a></p><p>Falls du kein Schließfach beantragt hast, kannst du diese E-Mail ignorieren.</p><p>Viele Grüße<br/>Deine Fachschaft Informatik</p>`,
  });

  console.log("=== Mail Output ===");
  console.log("Message sent: %s", info.messageId);
  console.log(qp.decode(info.message.toString()));
  console.log("===================");

  return { status: 200, data: { ok: true, messageId: info.messageId } };
}
