import { ISubPath } from '@/type/search';

// 목 경로의 구간. 경로 상세(지도)에서 쓰는 좌표를 함께 갖는다
export interface IMockSubPath extends ISubPath {
  trafficType: '도보' | '지하철' | '버스';
  coords?: { x: string; y: string }[];
}

export interface IMockRoute {
  type: string;
  lastBoardingTime: string;
  payment: number;
  subPath: IMockSubPath[];
}

export type TFetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;
