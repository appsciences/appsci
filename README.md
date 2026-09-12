# appsci

Appsci website

## Issues

- Firebase DNS instructions said to set host to `appsci.dev` for A and TXT records, which did not work. Setting it to `@` worked.
- Redirects directly to pdf files don't work

## Debug

To run local firebase hostiing simulator: `firebase emulators:start` and go to http://localhost:5000. Currently busted.

## Landing page development

The canonical homepage is `public/index.html`, based on the client-work design. Styles and optional keyboard navigation are in `public/styles.css` and `public/landing.js`. Content remains usable without JavaScript. Requirements are in [spec.md](spec.md).

Use Node.js 24+ and Python 3 for the development checks:

```sh
npm ci
npx playwright install chromium webkit
npm run preview
```

The local page is at http://127.0.0.1:4173. This simple server serves files; Firebase aliases such as `/meet` are verified against the Firebase preview. Stop the server before switching checkouts.

```sh
npm run format
npm run check
```

Checks cover formatting, HTML validity, JavaScript syntax, and desktop/mobile Chromium/WebKit browser flows. To check a deployed Firebase preview, set `PLAYWRIGHT_BASE_URL` to its URL and run `npm test`.

The homepage's stylesheet and script URLs include versions derived from their contents so returning visitors receive updated assets after a release. `npm run format` refreshes those versions after formatting; `npm run check` rejects stale versions.

Both Firebase workflows run the shared Site checks workflow before deploying. PRs receive a preview; a push to `main` deploys to production only after checks pass. Engineering review, exact-build QA, and production authorization are separate decisions; record them on the PR before merging.

## Deploy manually

Currently github action is set up to deploy from main or PR automatically. For manual deployment to Firebase Hosting:

1. Install Firebase CLI if not already installed: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Deploy to Firebase hosting: `firebase deploy`

The site will be deployed to the configured domain (currently appsci.dev).
