import { BymProPackageId, BYM_PRO_ENTITLEMENT_ID, BYM_PRO_PACKAGE_IDS } from '@/constants/revenuecat';
import { CustomerInfo, PurchasesEntitlementInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

export function getRevenueCatErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return fallback;
}

export function getBymProEntitlement(customerInfo: CustomerInfo | null): PurchasesEntitlementInfo | null {
  if (!customerInfo) return null;
  return customerInfo.entitlements.active[BYM_PRO_ENTITLEMENT_ID] ?? null;
}

export function hasBymProAccess(customerInfo: CustomerInfo | null): boolean {
  return getBymProEntitlement(customerInfo)?.isActive === true;
}

export function findBymProPackage(
  offering: PurchasesOffering | null,
  packageId: BymProPackageId
): PurchasesPackage | null {
  if (!offering) return null;

  const targetIdentifier = BYM_PRO_PACKAGE_IDS[packageId];
  return offering.availablePackages.find((pkg) => pkg.identifier === targetIdentifier) ?? null;
}

export function formatPackagePeriod(identifier: string): string {
  switch (identifier) {
    case BYM_PRO_PACKAGE_IDS.weekly:
      return 'Weekly';
    case BYM_PRO_PACKAGE_IDS.yearly:
      return 'Yearly';
    default:
      return identifier;
  }
}
