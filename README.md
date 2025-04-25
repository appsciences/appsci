# appsci
Appsci website

## Issues
- Firebase DNS instructions said to set host to `appsci.dev` for A and TXT records, which did not work. Setting it to `@` worked.
- Redirects directly to pdf files don't work

## Debug
To run local firebase hostiing simulator: `firebase emulators:start` and go to http://localhost:5000. Currently busted.

## Deploy manually
Currently github action is set up to deploy from main or PR automatically. For manual deployment to Firebase Hosting:

1. Install Firebase CLI if not already installed: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Deploy to Firebase hosting: `firebase deploy`

The site will be deployed to the configured domain (currently appsci.dev).



