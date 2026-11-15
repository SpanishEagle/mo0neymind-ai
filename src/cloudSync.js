import { supabase } from './supabaseClient';

// Solo estos datos financieros pertenecen a la cuenta. No guardamos contraseñas.
export const FINANCE_KEYS = [
  'mm_language', 'mm_transactions', 'mm_goals', 'mm_salary',
  'mm_bills', 'mm_investments', 'mm_claridad_hogar', 'mm_chat'
];

let activeUserId = null;
let saveTimer = null;
let lastWrite = Promise.resolve();
let lastError = null;
const listeners = new Set();

function report(status, detail = '') {
  for (const callback of listeners) callback(status, detail);
}

export function subscribeCloudStatus(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function captureFinanceData() {
  const result = {};
  for (const key of FINANCE_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try { result[key] = JSON.parse(value); }
      catch { /* nunca enviar valores mal formados */ }
    }
  }
  return result;
}

export function restoreFinanceData(data = {}) {
  for (const key of FINANCE_KEYS) {
    localStorage.removeItem(key);
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      localStorage.setItem(key, JSON.stringify(data[key]));
    }
  }
}

export function setCloudUser(userId) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  activeUserId = userId;
}

export async function loadCloudData(userId) {
  const { data, error } = await supabase
    .from('user_finances')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

async function persistSnapshot(userId, snapshot) {
  const { error } = await supabase
    .from('user_finances')
    .upsert({ user_id: userId, data: snapshot }, { onConflict: 'user_id' });
  if (error) throw error;
}

function enqueueSnapshot() {
  const userId = activeUserId;
  if (!userId) return lastWrite;
  const snapshot = captureFinanceData();
  report('saving');
  // Escrituras en orden: una respuesta antigua nunca debe pisar una nueva.
  const work = lastWrite.catch(() => {}).then(async () => {
    await persistSnapshot(userId, snapshot);
    if (activeUserId === userId) {
      lastError = null;
      report('saved');
    }
  }).catch(error => {
    lastError = error;
    if (activeUserId === userId) report('error', error.message);
    console.error('MoneyMind: no se pudieron sincronizar datos', error);
    throw error;
  });
  lastWrite = work;
  return work;
}

// Se llama después de guardar datos en localStorage.
export function queueCloudSave() {
  if (!activeUserId) return;
  if (saveTimer) clearTimeout(saveTimer);
  report('saving');
  saveTimer = setTimeout(() => {
    saveTimer = null;
    enqueueSnapshot().catch(() => {});
  }, 850);
}

export async function flushCloudSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
    await enqueueSnapshot();
  } else {
    await lastWrite;
  }
  if (lastError) throw lastError;
}
