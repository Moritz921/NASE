import nodemailer from "nodemailer";

export function getTransporter() {
    if (process.env.NODE_ENV === "production") {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    
    // DEV: log mail to console
    return nodemailer.createTransport({
        name: "localhost",
        streamTransport: true,
        newline: "unix",
        buffer: true,
    });
}