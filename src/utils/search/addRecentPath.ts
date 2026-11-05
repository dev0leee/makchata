import { IPathProps } from '@/type/search';

const isSamePath = (a: IPathProps, b: IPathProps) =>
  a.departure.location === b.departure.location &&
  a.arrival.location === b.arrival.location;

// 같은 출발지·도착지 경로는 하나만 남기고, 방금 검색한 경로를 맨 위로 올린다
export const addRecentPath = (paths: IPathProps[], path: IPathProps) => [
  path,
  ...paths.filter((prev) => !isSamePath(prev, path)),
];
