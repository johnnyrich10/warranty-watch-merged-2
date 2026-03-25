# Warranty Watch - Merged Starter Project

This zip is the merged version so you do **not** have to stitch the upgrades together by hand.

## What is already included
- Next.js App Router project
- Prisma + Postgres schema
- Clerk authentication scaffold
- Role-based access control
- Claim creation and claim management
- Work orders
- Photo uploads with UploadThing
- Text notifications with Twilio
- Email notifications with Resend

## Before you run it
You need accounts for these services:
- GitHub
- Vercel
- Neon (database)
- Clerk (login)
- UploadThing (photo uploads)
- Twilio (texting)
- Resend (email)

## Easy local setup
1. Copy `.env.example` to `.env.local`
2. Fill in the values
3. Run these commands:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## IMPORTANT: Clerk user IDs in the seed file
In `prisma/seed.ts`, the seeded users use placeholder Clerk IDs like:
- `replace_me_builder`
- `replace_me_coordinator`
- `replace_me_superintendent`
- `replace_me_vendor`
- `replace_me_homeowner`

After you create real users in Clerk, update those values to match the real Clerk user IDs, then run:

```bash
npm run prisma:seed
```

## Super simple live deployment
1. Put this project in GitHub
2. Create a free Neon database and copy `DATABASE_URL`
3. Create a free Clerk app and copy the keys
4. Create a free UploadThing app and copy `UPLOADTHING_TOKEN`
5. Create a Twilio account and copy your SMS keys
6. Create a Resend account and copy `RESEND_API_KEY`
7. Import the GitHub repo into Vercel
8. Add all environment variables in Vercel
9. Deploy

## Environment variables you need
See `.env.example`

## Good first production improvements
- Replace seeded role mapping with a webhook that auto-creates/updates app users from Clerk
- Add pagination and filters
- Add stronger per-builder data partitioning
- Add retry/error logging for SMS and email sends
- Add a nicer upload gallery UI
