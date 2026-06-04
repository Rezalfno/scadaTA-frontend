// src/config/api.ts
// Semua request ke backend menggunakan BASE_URL ini.
// Ganti nilai VITE_API_URL di file .env untuk switch local ↔ production.

export const BASE_URL = import.meta.env.VITE_API_URL as string;
