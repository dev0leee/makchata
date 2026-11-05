import { IFavorite } from '@/type/favorite';

// 데모에서 바로 칩을 눌러볼 수 있도록 미리 넣어두는 즐겨찾기
export const MOCK_FAVORITES: IFavorite[] = [
  {
    id: 'mock-home',
    name: '우리집',
    place: {
      location: '신림역',
      address: '서울 관악구 신림로 340',
      x: 126.929676,
      y: 37.484201,
    },
  },
  {
    id: 'mock-work',
    name: '회사',
    place: {
      location: '판교역',
      address: '경기 성남시 분당구 판교역로 160',
      x: 127.111203,
      y: 37.394761,
    },
  },
  {
    id: 'mock-school',
    name: '학교',
    place: {
      location: '혜화역',
      address: '서울 종로구 대학로 120',
      x: 127.001744,
      y: 37.582336,
    },
  },
];
