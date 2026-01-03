export enum CompanySize {
  STARTUP = 'Startup',
  SMB = 'SMB',
  MID_MARKET = 'Mid-market',
  ENTERPRISE = 'Enterprise'
}

export enum TechMaturity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum ProfileRole {
  SOFTWARE_ENGINEER = 'Software & AI Architecture',
  PERFORMANCE_MARKETING = 'Growth & Performance Marketing',
  SALES_BUSINESS_DEV = 'Revenue & Business Development',
  SALES = 'Strategic Sales & Partnerships',
  GROWTH_LEAD = 'Fractional Growth Leadership',
  AUTOMATION_CONSULTANT = 'Workflow Automation Expert'
}

export enum CareerGoalType {
  JOB = 'Full-time Strategic Role',
  BUSINESS = 'Strategic Project / Consultation'
}

export enum AppMode {
  STRATEGIC_AUDIT = 'Strategic Audit',
  MARKET_INTELLIGENCE = 'Market Intelligence'
}

export interface UserProfile {
  role: ProfileRole;
  skills: string;
  experienceYears: number;
  industries: string;
}

export interface TargetCriteria {
  industry: string;
  companySize: CompanySize;
  geography: string;
  techMaturity: TechMaturity;
  specificQuery?: string;
}

export interface CompanyAnalysis {
  companyName: string;
  industry: string;
  approxSize: string;
  businessModel: string;
  website: string;
  contactEmail: string;
  phoneNumber: string;
  linkedinUrl: string;
  instagramHandle: string;
  estimatedProblem: string;
  proposedSolution: string;
  businessImpact: string;
  emailSubject: string;
  emailBody: string;
  // New Intelligence fields
  recentNews?: string;
  planningSignals?: string;
  sourceUrls?: string[];
}

export interface AppState {
  profile: UserProfile;
  criteria: TargetCriteria;
  goal: CareerGoalType;
  mode: AppMode;
}