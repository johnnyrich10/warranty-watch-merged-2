import { sendSms } from '@/lib/twilio';
import { sendEmail } from '@/lib/email';

export async function notifyNewClaim(args: { claimNumber: string; category: string; address: string; builderAdminPhone?: string | null; builderAdminEmail?: string | null; }) {
  const message = `New warranty claim ${args.claimNumber} submitted for ${args.address}. Category: ${args.category}.`;
  await Promise.allSettled([
    args.builderAdminPhone ? sendSms(args.builderAdminPhone, message) : Promise.resolve(null),
    args.builderAdminEmail ? sendEmail({ to: args.builderAdminEmail, subject: `New warranty claim ${args.claimNumber}`, html: `<p>${message}</p>` }) : Promise.resolve(null),
  ]);
}

export async function notifyAssignedVendor(args: { claimNumber: string; address: string; vendorPhone?: string | null; vendorEmail?: string | null; }) {
  const message = `You have a new work order for claim ${args.claimNumber} at ${args.address}.`;
  await Promise.allSettled([
    args.vendorPhone ? sendSms(args.vendorPhone, message) : Promise.resolve(null),
    args.vendorEmail ? sendEmail({ to: args.vendorEmail, subject: `New work order for ${args.claimNumber}`, html: `<p>${message}</p>` }) : Promise.resolve(null),
  ]);
}

export async function notifyHomeownerStatusChange(args: { claimNumber: string; status: string; address: string; homeownerPhone?: string | null; homeownerEmail?: string | null; }) {
  const message = `Your warranty claim ${args.claimNumber} for ${args.address} is now ${args.status}.`;
  await Promise.allSettled([
    args.homeownerPhone ? sendSms(args.homeownerPhone, message) : Promise.resolve(null),
    args.homeownerEmail ? sendEmail({ to: args.homeownerEmail, subject: `Warranty claim ${args.claimNumber} update`, html: `<p>${message}</p>` }) : Promise.resolve(null),
  ]);
}
