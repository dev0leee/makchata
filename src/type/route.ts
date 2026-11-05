export interface ParamsProps {
  params: {
    id: string;
  };
}

// 검색 결과에서 선택한 경로. URL 에는 id(uuid)만 쓰고 상세 API 에는 index 를 쓴다
export interface ISelectedRoute {
  id: string;
  index: number;
}
