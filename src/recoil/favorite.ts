import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IFavorite } from '@/type/favorite';
import { MOCK_FAVORITES } from '@/mocks/mockFavorites';

const { persistAtom } = recoilPersist();

export const favoritesState = atom<IFavorite[]>({
  key: 'favorites',
  default: MOCK_FAVORITES,
  effects_UNSTABLE: [persistAtom],
});
