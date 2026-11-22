# EcoSip — BUE Smart Recycling & Rewards (Interactive Prototype)

A responsive React + TypeScript + Vite prototype for the **proposed** EcoSip/EcoPoints campus pilot at the British University in Egypt. Designed for a coursework demonstration and ready for static deployment on Vercel.

## What you can try

- **Student dashboard:** points, bottles, sessions, how it works, recent activity.
- **Simulated QR scan:** click "Simulate QR scan," select 1–20 bottles, and confirm a demo deposit.
- **Points wallet:** a sample rule of **10 points per accepted PET bottle**.
- **Demo rewards:** redeem points for sample café vouchers with generated demo codes (not valid at real cafés).
- **Activity history:** deposits and redemptions saved in the browser using `localStorage`.
- **Admin preview:** local demo metrics plus a checklist of unconfirmed operational prerequisites.
- **Mobile responsive:** desktop sidebar becomes a mobile drawer.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed in your terminal (typically http://localhost:5173).

## Deploy to Vercel

1. Extract this project and upload the folder to a new GitHub repository.
2. Open Vercel → **Add New → Project** → import the repository.
3. Framework should detect **Vite** (or select Vite manually).
4. Use build command `npm run build` and output directory `dist`.
5. Click **Deploy**.

You can also use the Vercel CLI:

```bash
npm install
npm run build
npx vercel
```

## Important limitations

**This is a UI/UX prototype, NOT a production-ready recycling platform.**

- No QR camera scanning, machine API, backend, database, login, access control, or live university data.
- Simulated deposits are triggered by the user, not verified by a machine.
- Café partners, rewards, voucher values, and 10 points/bottle are **illustrative assumptions**, not approved agreements.
- All activity is saved in the current browser only. Clearing browser storage or pressing Reset demo deletes it.
- Admin preview is a presentation concept without secured administrator authentication.
- PET mass illustration assumes 25 g/bottle and must not be presented as a verified measurement.
- University approval, machine technical compatibility, financial arrangements, and recycling collection partnerships remain unconfirmed.

## Suggested production architecture (future phase, not included)

- Secure sign-in linked to approved university identity provider.
- Server-side transaction ledger and tamper-resistant point calculation.
- A verified RVM event ingestion endpoint with authenticity checks and deduplication.
- Verified QR session lifecycle and device-to-student association.
- Café merchant verification with single-use vouchers.
- Privacy / consent controls, audit logging, admin authorization, and monitoring.
- Real recycling collection partner coordination and measurement.

## Project note

EcoSip supports the *proposed* SDG 12, Target 12.5 campus pilot concept. The student workflow and planned feature categories are adapted from `EcoPoints_Project_Proposal.docx`; the aesthetics, placeholder rewards, demo assumptions and local simulated functionality are design decisions for this prototype.
