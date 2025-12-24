
export enum MembershipType {
  MONTHLY = '1m',
  QUARTERLY = '3m',
  ANNUAL = 'anual'
}

export type UserRole = 'worker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passcode: string;
  createdAt?: string;
}

export interface MonthlyClient {
  id: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  startDate: string;
  expiryDate: string;
  plan: MembershipType;
  amountPaid: number;
  status: 'active' | 'expired';
  registeredBy: string;
}

export interface DailyCheckin {
  id: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  checkinTime: string;
  amount: number;
  registeredBy: string;
}

export type View = 'overview' | 'payments' | 'monthly' | 'daily' | 'alerts' | 'history' | 'workers';
