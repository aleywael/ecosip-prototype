# EcoSip — Mobile Prototype v2

A mobile-first, interactive student concept for the proposed **EcoSip / EcoPoints** one-RVM recycling pilot at the British University in Egypt (BUE).

## What's new

- Phone-sized presentation on desktop; full-screen mobile layout on phones
- Five-tab bottom navigation, plus admin concept accessible from **Me**
- Professional café rewards catalogue with photographic examples, search, category filters, saved items, and detail sheets
- Example partner names **TBS** and **La Poire** (no partnership implied)
- QR/deposit simulation with 10 demo points per bottle
- Browser-local points, reward redemptions, sample voucher codes and activity timeline
- Readiness checklist for an eventual real pilot

## Important demo limitations

- This is a browser-based *mobile-style web app*, **not** an iOS or Android native app.
- The scan is simulated; it does not use a camera or communicate with an RVM.
- Initial points and bottle counts are sample values; reset under **Me**.
- No user authentication, backend, payments, or actual campus integration exists.
- Café names are hypothetical examples for coursework, and the photographed foods/drinks are **not official menu imagery** of TBS, La Poire, or any other café.
- All sample voucher codes are invalid for real purchases.
- Photographs are linked from Unsplash's image CDN; an internet connection is needed to display them. If blocked, emoji fallbacks appear.
- Images are used under the Unsplash License: https://unsplash.com/license

## Local development

```bash
npm install
npm run dev
npm run build
```

## Update your existing Vercel project (recommended)

1. **Do not delete your GitHub repository or Vercel project.** Create a GitHub tag or branch for v1 if you want a rollback point.
2. Unzip the project.
3. In `aleywael/ecosip-prototype`, replace the content of `src/main.tsx`, `src/style.css`, `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, `vercel.json`, and optionally `public/favicon.svg` with the equivalent v2 files.
4. Be sure the `src` folder contains `main.tsx` and `style.css`, and `package.json` is at repository root.
5. Commit the changes to `main`. Vercel normally detects the commit and deploys it automatically.
6. Use Vite preset, `npm run build`, `dist` output directory, and root `./`.

For the GitHub web interface, edit `src/main.tsx` and `src/style.css` using the pencil button. For many file updates, GitHub Desktop or a local Git client is easier.

## Project file structure

```
index.html
package.json
tsconfig.json
vite.config.ts
vercel.json
public/favicon.svg
src/main.tsx
src/style.css
```

## Next steps for a real pilot

Specify the RVM's supported QR/API protocol, build a secure server and student authentication, validate bottle acceptance and transactional point issuance, obtain confirmed café/recycling partner agreements, implement non-forgeable redemptions and admin access controls, and establish a privacy and data retention plan.
