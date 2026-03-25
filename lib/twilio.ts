import twilio from 'twilio';

export const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendSms(to: string, body: string) {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) return null;
  return twilioClient.messages.create({ to, from: process.env.TWILIO_PHONE_NUMBER, body });
}
