import { IPathProps } from '@/type/search';

// 출발지·도착지를 선택하지 않은 상태
export const EMPTY_LOCATION: IPathProps['departure'] = {
  location: '',
  address: '',
  x: 0,
  y: 0,
};

export const EMPTY_PATH: IPathProps = {
  departure: EMPTY_LOCATION,
  arrival: EMPTY_LOCATION,
};
