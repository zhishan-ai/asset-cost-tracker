export type AssetStatus = '全部' | '使用中' | '收藏中';

export interface Asset {
  id: string;
  name: string;
  price: number;
  purchaseDate: string; // YYYY-MM-DD
  status?: AssetStatus;
  icon?: string;
}
