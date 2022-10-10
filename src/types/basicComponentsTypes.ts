import { ReactNode } from 'react';

export interface ITab {
  content: ReactNode;
  title: string;
  id: string;
}

export interface IBreadcrumb {
  linkName: string;
  link: string;
  id?: string | number;
}

export interface IList {
  title: string;
  id?: string | number;
}

export interface INavbar {
  link: string;
  title: string;
  id: string;
  icon: ReactNode;
}

export interface IMainList {
  label: ReactNode;
  value: string;
  id: string;
  apiValue?: string;
}

export interface ILink {
  link: string;
  name: string;
  isExact?: boolean;
}

export interface IAlertInfo {
  type: string;
  title: string;
  text: string;
  buttonText?: string;
  hideCancelBtn?: boolean;
}

export interface INotification {
  title: string;
  text: string;
  date: string;
}

export interface IModalBudget {
  id: string;
  price_budget: string;
  expenses_name: string;
  expense_date?: number;
  line_budget_id?: number;
  farm_id?: number;
  type: string;
  budget_type: string;
  date?: number;
  due_date?: number;
  from?: string;
  account?: string;
  to_xero?: boolean;
}
