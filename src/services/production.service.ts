// src/services/production.service.ts
import { BASE_URL } from '../config/api';

export const getLatestProduction = async () => {
  const res = await fetch(`${BASE_URL}/api/data/latest`);
  if (!res.ok) throw new Error('Production fetch failed');
  return res.json();
};