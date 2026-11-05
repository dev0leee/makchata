import { useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { selectedRouteState } from '@/recoil/search';

// URL 에는 경로 uuid 만 노출하고, 상세 API 에 필요한 경로 순번은 검색 결과에서 선택할 때 저장해둔 값으로 찾는다
export default function useSelectedRouteIndex() {
  const { id } = useParams();
  const selectedRoute = useRecoilValue(selectedRouteState);

  return selectedRoute?.id === id ? selectedRoute.index : 0;
}
