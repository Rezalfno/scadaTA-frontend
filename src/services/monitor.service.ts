// src/services/monitor.service.ts
import { BASE_URL } from '../config/api';

export const getMonitorData = async () => {
  const res = await fetch(`${BASE_URL}/api/data/monitor`);
  if (!res.ok) throw new Error('Monitor fetch failed');
  return res.json();
};