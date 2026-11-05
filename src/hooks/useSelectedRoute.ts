import { useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { selectedRouteState } from '@/recoil/search';

// URL 의 경로 uuid 와 검색 결과에서 고른 경로가 같을 때만 그 경로를 돌려준다
export default function useSelectedRoute() {
  const { id } = useParams();
  const selectedRoute = useRecoilValue(selectedRouteState);

  return selectedRoute?.id === id ? selectedRoute : null;
}
