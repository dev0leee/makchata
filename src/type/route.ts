import { IPathProps } from '@/type/search';

export interface ParamsProps {
  params: {
    id: string;
  };
}

// 검색 결과에서 선택한 경로. URL 에는 id(uuid)만 쓰고 상세 API 에는 index 를 쓴다.
// 새로고침해도 경로 화면을 다시 그릴 수 있게 출발지·도착지와 막차 정보도 같이 저장한다
export interface ISelectedRoute {
  id: string;
  index: number;
  type: string;
  lastBoardingTime: string;
  path: IPathProps;
}
