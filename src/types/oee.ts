export interface OEEData {
  id: number;
  loading_time: number;
  operating_time: number;
  downtime: number;
  cycle_time: number;
  total_product: number;
  good_product: number;
  bad_product: number;
  counter_distribusi: number;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  created_at: string;
}
