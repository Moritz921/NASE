import { prisma } from "@/lib/prisma"
import { getTransporter } from "@/lib/mailer"
import { NextResponse } from "next/server"

export async function POST(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params
    const wishId = Number(id)

    const wish = await prisma.wish.findUnique({ where: { id: wishId } })
    if (!wish) return NextResponse.json({ error: "Wish not found" }, { status: 404 })

    const transporter = getTransporter()
    const confirmUrl = `${process.env.BASE_URL}/lockerrequest/confirm?token=${wish.confirmToken}`

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: `${wish.sNumber}@stud.uni-frankfurt.de`,
        subject: "Bitte Schließfach-Anfrage bestätigen",
        text: `Hallo ${wish.sNumber}, bitte bestätige deine Schließfach-Anfrage: ${confirmUrl}`,
        html: `<p>Hallo ${wish.sNumber}, bitte bestätige deine Schließfach-Anfrage: <a href="${confirmUrl}">Bestätigen</a></p>`
    })

    return NextResponse.json({ ok: true })
}
