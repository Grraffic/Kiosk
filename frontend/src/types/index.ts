export interface LocaleInfo {
  locale: string;
  address: string;
  contactPerson: string;
  contactDetails: string;
  googleMapLink: string;
}

export interface Officer {
  id: string;
  name: string;
  position: string;
  picture?: string;
}

export interface GroupMember {
  name: string;
}

export interface Group {
  id: string;
  name: string;
  picture?: string;
  members: GroupMember[];
  toka?: string;
  combinedToka?: string;
}

export interface EventSubItem {
  time?: string;
  description: string;
}

export interface EventItem {
  id: string;
  date: string; // Start date e.g. "2026-04-12"
  endDate?: string;
  label: string;
  description?: string;
  showCountdown?: boolean;
  items?: EventSubItem[];
  wishDate?: boolean;
}

export interface ActivityMeeting {
  date: string;
  name: string;
  time: string;
}

export interface Activity {
  id: string;
  category: string;
  schedule?: string;
  meetings?: ActivityMeeting[];
}

export interface MinistryCoordinator {
  name: string;
  picture?: string;
}

export interface MinistryMember {
  name: string;
}

export interface Ministry {
  id: string;
  name: string;
  coordinators: MinistryCoordinator[];
  members?: MinistryMember[];
}

export interface Update {
  id: string;
  text: string;
  highlight?: boolean;
}

export interface KioskData {
  localeInfo: LocaleInfo;
  officers: Officer[];
  groups: Group[];
  events: EventItem[];
  activities: Activity[];
  ministries: Ministry[];
  mfaPosterUrl?: string;
  mfaDriveLink?: string;
  updates: Update[];
}
