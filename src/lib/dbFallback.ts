import fs from 'fs';
import path from 'path';
import { isDbFallbackActive } from './dbState';
import {
  MOCK_USERS,
  MOCK_LEADS,
  MOCK_CLIENTS,
  MOCK_SUBSCRIPTIONS,
  MOCK_ORDERS,
  MOCK_ORDER_STAGE_HISTORIES,
  MOCK_TASKS,
  MOCK_PAYMENTS,
  MOCK_FOLLOWUPS,
  MOCK_NOTIFICATIONS,
  MOCK_FILES,
  MOCK_ACTIVITY_LOGS
} from './mockData';

const DB_FILE_PATH = path.join(process.cwd(), 'prisma', 'dev-db.json');

export interface LocalDb {
  users: typeof MOCK_USERS;
  leads: typeof MOCK_LEADS;
  clients: typeof MOCK_CLIENTS;
  subscriptions: typeof MOCK_SUBSCRIPTIONS;
  orders: typeof MOCK_ORDERS;
  orderStageHistories: typeof MOCK_ORDER_STAGE_HISTORIES;
  tasks: typeof MOCK_TASKS;
  payments: typeof MOCK_PAYMENTS;
  followUps: typeof MOCK_FOLLOWUPS;
  notifications: typeof MOCK_NOTIFICATIONS;
  files: typeof MOCK_FILES;
  activityLogs: typeof MOCK_ACTIVITY_LOGS;
  invoiceSettings: {
    companyName: string;
    agencyLogo: string;
    gstNumber: string;
    address: string;
    email: string;
    whatsappApi: string;
  };
}

function initializeDbFile() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialDb: LocalDb = {
      users: MOCK_USERS,
      leads: MOCK_LEADS,
      clients: MOCK_CLIENTS,
      subscriptions: MOCK_SUBSCRIPTIONS,
      orders: MOCK_ORDERS,
      orderStageHistories: MOCK_ORDER_STAGE_HISTORIES,
      tasks: MOCK_TASKS,
      payments: MOCK_PAYMENTS,
      followUps: MOCK_FOLLOWUPS,
      notifications: MOCK_NOTIFICATIONS,
      files: MOCK_FILES,
      activityLogs: MOCK_ACTIVITY_LOGS,
      invoiceSettings: {
        companyName: "Creative Plus Digital Marketing Agency",
        agencyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
        gstNumber: "27AAAAA1111A1Z1",
        address: "101, Maker Chambers, Nariman Point, Mumbai, India",
        email: "contact@creativeplus.com",
        whatsappApi: "+91 99999 88888"
      }
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

export function readDb(): LocalDb {
  initializeDbFile();
  const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeDb(data: LocalDb) {
  initializeDbFile();
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

