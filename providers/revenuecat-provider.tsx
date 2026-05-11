import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { BymProPackageId, BYM_PRO_ENTITLEMENT_ID, REVENUECAT_API_KEY } from '@/constants/revenuecat';
import { findBymProPackage, getBymProEntitlement, getRevenueCatErrorMessage, hasBymProAccess } from '@/utils/revenuecat';

type RevenueCatContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  appUserId: string | null;
  isAnonymous: boolean;
  isPro: boolean;
  refreshCustomerInfo: () => Promise<CustomerInfo | null>;
  refreshOfferings: () => Promise<PurchasesOffering | null>;
  refreshAll: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo | null>;
  purchaseByPackageId: (packageId: BymProPackageId) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  presentPaywall: () => Promise<PAYWALL_RESULT | null>;
  presentPaywallIfNeeded: () => Promise<PAYWALL_RESULT | null>;
  presentCustomerCenter: () => Promise<void>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const configuredRef = useRef(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const isPro = hasBymProAccess(customerInfo);

  const refreshIdentity = useCallback(async () => {
    try {
      const [nextAppUserId, nextIsAnonymous] = await Promise.all([
        Purchases.getAppUserID(),
        Purchases.isAnonymous(),
      ]);

      setAppUserId(nextAppUserId);
      setIsAnonymous(nextIsAnonymous);
    } catch (nextError) {
      setError(getRevenueCatErrorMessage(nextError, 'Unable to retrieve subscription identity.'));
    }
  }, []);

  const refreshCustomerInfo = useCallback(async (): Promise<CustomerInfo | null> => {
    try {
      const nextCustomerInfo = await Purchases.getCustomerInfo();
      setCustomerInfo(nextCustomerInfo);
      setError(null);
      return nextCustomerInfo;
    } catch (nextError) {
      setError(getRevenueCatErrorMessage(nextError, 'Unable to retrieve subscription status.'));
      return null;
    }
  }, []);

  const refreshOfferings = useCallback(async (): Promise<PurchasesOffering | null> => {
    try {
      const offerings = await Purchases.getOfferings();
      const nextOffering = offerings.current ?? null;
      setCurrentOffering(nextOffering);
      setError(null);
      return nextOffering;
    } catch (nextError) {
      setError(getRevenueCatErrorMessage(nextError, 'Unable to load subscription products.'));
      return null;
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshCustomerInfo(), refreshOfferings(), refreshIdentity()]);
  }, [refreshCustomerInfo, refreshIdentity, refreshOfferings]);

  async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
    try {
      setError(null);
      const result = await Purchases.purchasePackage(pkg);
      setCustomerInfo(result.customerInfo);
      await refreshIdentity();
      return result.customerInfo;
    } catch (nextError) {
      const message = getRevenueCatErrorMessage(nextError, 'Purchase failed.');
      setError(message);
      Alert.alert('Purchase failed', message);
      return null;
    }
  }

  async function purchaseByPackageId(packageId: BymProPackageId): Promise<CustomerInfo | null> {
    const pkg = findBymProPackage(currentOffering, packageId);

    if (!pkg) {
      const message = `The ${packageId} package is not available in the current offering.`;
      setError(message);
      Alert.alert('Package unavailable', message);
      return null;
    }

    return purchasePackage(pkg);
  }

  async function restorePurchases(): Promise<CustomerInfo | null> {
    try {
      setError(null);
      const nextCustomerInfo = await Purchases.restorePurchases();
      setCustomerInfo(nextCustomerInfo);
      await refreshIdentity();
      return nextCustomerInfo;
    } catch (nextError) {
      const message = getRevenueCatErrorMessage(nextError, 'Unable to restore purchases.');
      setError(message);
      Alert.alert('Restore failed', message);
      return null;
    }
  }

  async function presentPaywall(): Promise<PAYWALL_RESULT | null> {
    try {
      setError(null);
      const result = await RevenueCatUI.presentPaywall(
        currentOffering ? { offering: currentOffering } : undefined
      );
      await refreshAll();
      return result;
    } catch (nextError) {
      const message = getRevenueCatErrorMessage(nextError, 'Unable to open the paywall.');
      setError(message);
      Alert.alert('Paywall error', message);
      return null;
    }
  }

  async function presentPaywallIfNeeded(): Promise<PAYWALL_RESULT | null> {
    try {
      setError(null);
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: BYM_PRO_ENTITLEMENT_ID,
        offering: currentOffering ?? undefined,
      });
      await refreshAll();
      return result;
    } catch (nextError) {
      const message = getRevenueCatErrorMessage(nextError, 'Unable to open the paywall.');
      setError(message);
      Alert.alert('Paywall error', message);
      return null;
    }
  }

  async function presentCustomerCenter(): Promise<void> {
    try {
      setError(null);
      await RevenueCatUI.presentCustomerCenter({
        callbacks: {
          onRestoreCompleted: ({ customerInfo: restoredCustomerInfo }) => {
            setCustomerInfo(restoredCustomerInfo);
          },
          onRestoreFailed: ({ error: restoreError }) => {
            setError(restoreError.message);
          },
        },
      });
      await refreshAll();
    } catch (nextError) {
      const message = getRevenueCatErrorMessage(nextError, 'Unable to open Customer Center.');
      setError(message);
      Alert.alert('Customer Center unavailable', message);
    }
  }

  useEffect(() => {
    if (configuredRef.current) {
      return;
    }

    configuredRef.current = true;
    let isMounted = true;

    const customerInfoListener = (nextCustomerInfo: CustomerInfo) => {
      if (!isMounted) return;
      setCustomerInfo(nextCustomerInfo);
    };

    async function configureRevenueCat() {
      if (process.env.EXPO_OS === 'web') {
        if (!isMounted) return;
        setIsLoading(false);
        setError('RevenueCat mobile purchases are disabled on web unless you configure RevenueCat Web Billing.');
        return;
      }

      try {
        await Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.WARN);
        Purchases.configure({
          apiKey: REVENUECAT_API_KEY,
          entitlementVerificationMode: Purchases.ENTITLEMENT_VERIFICATION_MODE.INFORMATIONAL,
          diagnosticsEnabled: __DEV__,
          shouldShowInAppMessagesAutomatically: true,
        });
        Purchases.addCustomerInfoUpdateListener(customerInfoListener);
        await refreshAll();

        if (isMounted) {
          setIsConfigured(true);
          setIsLoading(false);
          setError(null);
        }
      } catch (nextError) {
        if (!isMounted) return;
        setError(getRevenueCatErrorMessage(nextError, 'RevenueCat failed to initialize.'));
        setIsLoading(false);
      }
    }

    void configureRevenueCat();

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && configuredRef.current) {
        void refreshAll();
      }
    });

    return () => {
      isMounted = false;
      appStateSubscription.remove();
      Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
    };
  }, [refreshAll]);

  return (
    <RevenueCatContext.Provider
      value={{
        isConfigured,
        isLoading,
        error,
        customerInfo,
        currentOffering,
        appUserId,
        isAnonymous,
        isPro,
        refreshCustomerInfo,
        refreshOfferings,
        refreshAll,
        purchasePackage,
        purchaseByPackageId,
        restorePurchases,
        presentPaywall,
        presentPaywallIfNeeded,
        presentCustomerCenter,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);

  if (!context) {
    throw new Error('useRevenueCat must be used within RevenueCatProvider.');
  }

  return {
    ...context,
    proEntitlement: getBymProEntitlement(context.customerInfo),
  };
}
