import { ILocation } from '@/type/search';

// 즐겨찾기 장소 (명칭 + 장소)
export interface IFavorite {
  id: string;
  name: string;
  place: ILocation;
}
