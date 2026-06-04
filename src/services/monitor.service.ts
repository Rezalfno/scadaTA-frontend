// src/services/monitor.service.ts

export const getMonitorData = async () => {
  const res = await fetch('http://localhost:3000/api/data/monitor');
  if (!res.ok) throw new Error('Monitor fetch failed');
  return res.json();
};