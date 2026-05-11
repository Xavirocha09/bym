export const REVENUECAT_API_KEY = 'test_iKreiTcOMbNdfHkbVRWMFRWOkDx';

export const BYM_PRO_ENTITLEMENT_ID = 'BYM Pro';

export const BYM_PRO_PACKAGE_IDS = {
  weekly: 'weekly',
  yearly: 'yearly',
} as const;

export type BymProPackageId = keyof typeof BYM_PRO_PACKAGE_IDS;
