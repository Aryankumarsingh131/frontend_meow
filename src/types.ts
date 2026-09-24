export type ScreenMode = 'test-capture' | 'source-detail' | 'supervisor-cases' | 'reports';

export type CaseStatus =
  | 'review_needed'
  | 'awaiting_lab'
  | 'action_required'
  | 'retest_due'
  | 'closure_review'
  | 'closed';

export interface TestCase {
  id: string;
  sourceId: string;
  sourceName: string;
  location: string;
  district: string;
  reportedAt: string;
  reportedTimestamp: number;
  deadlineHours: number;
  deadlineLabel: string;
  status: CaseStatus;
  confidence: number;
  stripAlignment: 'good' | 'fair' | 'poor';
  lighting: 'good' | 'fair' | 'poor';
  clarity: 'good' | 'fair' | 'poor';
  operator: {
    id: string;
    name: string;
    role: string;
    phone: string;
  };
  flags: Array<{
    parameter: string;
    value: string;
    standard: string;
    severity: 'danger' | 'warning' | 'info';
  }>;
  observations: {
    odour: string;
    turbidity: string;
    residualChlorine: number;
    sanitaryRemarks: string;
  };
  gps: {
    lat: number;
    lng: number;
    accuracy: string;
  };
  evidencePhotoUrl?: string;
  auditTrail: Array<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    type: 'creation' | 'assignment' | 'lab' | 'action' | 'retest' | 'closure';
    notes?: string;
  }>;
  labDetails?: {
    labName: string;
    assignedAt: string;
    reportNumber?: string;
    verifiedResult?: string;
    verifiedBy?: string;
    isVerified: boolean;
  };
  remediation?: {
    actionPlan: string;
    assignedTo: string;
    completedAt?: string;
    evidenceNotes?: string;
    accepted: boolean;
  };
  retest?: {
    scheduledDate: string;
    retestSampleId?: string;
    result?: string;
    isPassed?: boolean;
  };
  closureDisposition?: string;
  closureExemptions?: {
    labExemption?: string;
    actionExemption?: string;
    retestExemption?: string;
  };
}

export interface WaterParameter {
  id: string;
  name: string;
  symbol: string;
  standard: string;
  idealRange: string;
  currentValue: string;
  unit: string;
  status: 'Good' | 'Safe' | 'Warning' | 'Critical';
  progressPercentage: number;
  colorScheme: 'teal' | 'emerald' | 'amber' | 'rose' | 'purple';
}
