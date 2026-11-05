import {
  MOCK_CLOSE_DISTANCE_KM,
  MOCK_CLOSE_DISTANCE_MESSAGE,
} from '@/mocks/mockConstants';
import { MOCK_PLACES } from '@/mocks/mockPlaces';
import { IMockRoute, IMockSubPath } from '@/type/mock';
import { getDistanceKm } from '@/utils/location/distance';

const findNearestPlace = (x: number, y: number) =>
  MOCK_PLACES.reduce((nearest, place) =>
    getDistanceKm(x, y, place.x, place.y) <
    getDistanceKm(x, y, nearest.x, nearest.y)
      ? place
      : nearest
  );

const searchPlaces = (keyword: string) => {
  const normalized = keyword.replace(/\s/g, '');
  const matched = MOCK_PLACES.filter((place) =>
    `${place.place_name}${place.address_name}`
      .replace(/\s/g, '')
      .includes(normalized)
  );
  // 목록에 없는 검색어도 데모를 이어갈 수 있도록 전체 장소를 보여준다
  return matched.length > 0 ? matched : MOCK_PLACES;
};

// 지도에 그릴 경로 좌표. 직선이 아닌 완만한 곡선으로 만들어 실제 노선처럼 보이게 한다
const createCoords = (sx: number, sy: number, ex: number, ey: number) =>
  Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const bend = Math.sin(Math.PI * t) * 0.15;
    return {
      x: String(sx + (ex - sx) * t - (ey - sy) * bend),
      y: String(sy + (ey - sy) * t + (ex - sx) * bend),
    };
  });

const walk = (distance: number): IMockSubPath => ({
  trafficType: '도보',
  distance,
  sectionTime: Math.max(1, Math.round(distance / 70)),
});

const ride = (
  trafficType: '지하철' | '버스',
  km: number,
  [sx, sy, ex, ey]: number[]
): IMockSubPath => {
  const minutesPerKm = trafficType === '지하철' ? 2 : 3;
  return {
    trafficType,
    distance: Math.round(km * 1000),
    sectionTime: Math.round(km * minutesPerKm + 4),
    stationCount: Math.max(
      1,
      Math.round(km / (trafficType === '지하철' ? 1.3 : 0.6))
    ),
    startName: findNearestPlace(sx, sy).place_name,
    endName: findNearestPlace(ex, ey).place_name,
    coords: createCoords(sx, sy, ex, ey),
  };
};

// 출발지와 도착지 거리만으로 경로를 만들어 같은 요청에는 항상 같은 결과를 준다
const createRoutes = (sx: number, sy: number, ex: number, ey: number) => {
  const km = getDistanceKm(sx, sy, ex, ey);
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const extraFare = Math.floor(Math.max(0, km - 10) / 5) * 100;

  const routes: IMockRoute[] = [
    {
      type: '지하철',
      // 지하철 막차 시간은 'HHMM', 그 외는 'HH:MM' 형식 (utils/time/boardingTime.ts 참고)
      lastBoardingTime: '2342',
      payment: 1400 + extraFare,
      subPath: [
        walk(420),
        ride('지하철', km * 1.1, [sx, sy, ex, ey]),
        walk(310),
      ],
    },
    {
      type: '버스',
      lastBoardingTime: '23:18',
      payment: 1500 + extraFare,
      subPath: [
        walk(240),
        ride('버스', km * 1.25, [sx, sy, ex, ey]),
        walk(380),
      ],
    },
    {
      type: '지하철+버스',
      lastBoardingTime: '23:05',
      payment: 1550 + extraFare,
      subPath: [
        walk(350),
        ride('지하철', km * 0.6, [sx, sy, mx, my]),
        walk(160),
        ride('버스', km * 0.6, [mx, my, ex, ey]),
        walk(270),
      ],
    },
  ];

  // 자전거는 막차가 없어 구간 없이 거리(실제 길은 직선의 약 1.2배)와 시속 15km 기준 소요시간만 준다
  const bikeDistance = Math.round(km * 1.2 * 1000);
  const bike = {
    type: '자전거',
    lastBoardingTime: '',
    payment: 0,
    subPath: [],
    totalDistance: bikeDistance,
    totalTime: Math.round((bikeDistance / 1000 / 15) * 60),
  };

  return [
    ...routes.map((route) => ({
      ...route,
      totalTime: route.subPath.reduce((sum, path) => sum + path.sectionTime, 0),
      totalDistance: route.subPath.reduce(
        (sum, path) => sum + path.distance,
        0
      ),
    })),
    bike,
  ];
};

/**
 * utils/apis/path.ts 가 보내는 요청 경로(API_BASE 이후)에 맞는 목 응답을 만든다.
 * 목 API 요청이 아니면 undefined 를 돌려줘 원래 fetch 로 보내게 한다.
 */
export const handleMockRequest = (path: string): unknown => {
  const { pathname, searchParams } = new URL(path, 'http://mock.local');
  const numberParam = (key: string) => Number(searchParams.get(key));

  if (pathname === '/' && searchParams.has('latitude')) {
    const place = findNearestPlace(
      numberParam('longitude'),
      numberParam('latitude')
    );
    return { location: place.place_name, x: place.x, y: place.y };
  }

  if (pathname === '/search' && searchParams.has('search')) {
    return searchPlaces(searchParams.get('search') ?? '');
  }

  const destinationMatch = pathname.match(/^\/destination(?:\/(\d+))?$/);
  if (destinationMatch && searchParams.has('sx')) {
    const [sx, sy, ex, ey] = ['sx', 'sy', 'ex', 'ey'].map(numberParam);
    if (getDistanceKm(sx, sy, ex, ey) < MOCK_CLOSE_DISTANCE_KM) {
      return MOCK_CLOSE_DISTANCE_MESSAGE;
    }

    const routes = createRoutes(sx, sy, ex, ey);
    const [, index] = destinationMatch;
    if (index === undefined) return { route: routes };

    const route = routes[Number(index)] ?? routes[0];
    return {
      type: route.type,
      lastBoardingTime: route.lastBoardingTime,
      totalTime: route.totalTime,
      path: route.subPath,
    };
  }

  return undefined;
};
