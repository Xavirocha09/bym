export type ScanType = 'profile' | 'chat' | 'full';

export type CautionLevel = 'low' | 'moderate' | 'elevated' | 'high';

export type SignalSeverity = 'info' | 'low' | 'medium' | 'high';

export interface Signal {
  id: string;
  title: string;
  description: string;
  severity: SignalSeverity;
}

export interface ScanResult {
  id: string;
  scanType: ScanType;
  cautionLevel: CautionLevel;
  summary: string;
  photoSignals: Signal[];
  profileSignals: Signal[];
  chatSignals: Signal[];
  nextSteps: string[];
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  scanType: ScanType;
  cautionLevel: CautionLevel;
  summary: string;
  createdAt: string;
}

export interface ContextQuestion {
  id: string;
  text: string;
  description: string;
}
