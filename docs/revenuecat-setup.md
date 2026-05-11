# RevenueCat Setup

This app is wired for RevenueCat with:

- Entitlement: `BYM Pro`
- Package identifiers: `weekly`, `yearly`
- RevenueCat public SDK key: `test_iKreiTcOMbNdfHkbVRWMFRWOkDx`

## 1. Install SDKs

```bash
npm install --save react-native-purchases react-native-purchases-ui
```

## 2. Configure RevenueCat dashboard

1. Create or open the BYM app in RevenueCat.
2. Add your App Store app and Google Play app.
3. Create an entitlement named `BYM Pro`.
4. Create store products for:
   - weekly subscription product
   - yearly subscription product
5. Import those store products into RevenueCat.
6. Create a current offering in RevenueCat.
7. Add two packages to that offering:
   - package identifier `weekly`
   - package identifier `yearly`
8. Attach both packages to the `BYM Pro` entitlement.
9. Build a paywall in RevenueCat and assign it to the current offering.
10. Enable Customer Center in RevenueCat if you want users to self-manage subscriptions.

## 3. App integration points

- Provider: `providers/revenuecat-provider.tsx`
- Helpers: `utils/revenuecat.ts`
- Constants: `constants/revenuecat.ts`
- Direct paywall calls: `presentPaywall()` and `presentPaywallIfNeeded()` from the RevenueCat provider
- Home entry point: `app/(tabs)/(home)/index.tsx`
- Settings management UI: `app/(tabs)/(settings)/index.tsx`

## 4. Notes

- For real native purchases, test in a development build or production build, not Expo Go.
- The app currently uses anonymous RevenueCat users. If you add app auth later, call `Purchases.logIn(appUserId)` after sign-in.
- The provider enables informational entitlement verification and refreshes customer info when the app becomes active.
