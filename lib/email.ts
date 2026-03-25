import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend || !process.env.NOTIFICATION_FROM_EMAIL) return null;
  return resend.emails.send({ from: process.env.NOTIFICATION_FROM_EMAIL, to, subject, html });
}
