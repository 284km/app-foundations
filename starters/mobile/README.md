# Mobile starter

TypeScript, React Native, and Expo. Requires Node.js 24. Start the Web starter's local API and database first.

```sh
npm ci
cp .env.example .env
npm run dev
```

For iOS simulator use `EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:3000`. For Android emulator use `http://10.0.2.2:3000`. Restart Expo after configuration changes. With no override the app selects the emulator default by platform. A physical phone does not share host loopback; networking, HTTPS, OS transport restrictions, and authentication need a separate setup. Do not make the unauthenticated local API publicly accessible.

```sh
npm run typecheck
npx expo install --check
npm run build
# Development builds require the platform toolchains:
npm run ios
npm run android
```

`build` exports iOS/Android JavaScript bundles; it does not compile native apps or test a device. Development builds can use native libraries. No Expo account, EAS project, signing credential, or remote build service is configured. Expo Go availability depends on its SDK support and is not the baseline's native verification.

Change `app.json` names and `org.example` application identifiers for a real app. Update Expo, React Native, and React as a compatible set. The UI has local error and loading states; there is no persistent offline queue or synchronization.

## Source and maintenance

Generated from [App Foundations](https://github.com/284km/app-foundations). English is the primary language. The root repository maintains Japanese decision records and guides. Keep the lockfile and `.app-foundations.json` when starting an application. Upstream changes are not applied automatically; follow the maintenance guide and compare against the recorded source revision.

Use synthetic data only. Authentication, per-resource authorization, production deployment, and offline synchronization are not implemented. Public client environment variables must never contain credentials. Replace example identifiers before distributing an application.
