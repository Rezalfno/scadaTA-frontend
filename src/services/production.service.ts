// src/services/production.service.ts

export const getLatestProduction = async () => {
  const res = await fetch('http://localhost:3000/api/data/latest');
  if (!res.ok) throw new Error('Production fetch failed');
  return res.json();
};