import { ILocation } from '@/type/search';
import { getDistanceKm } from '@/utils/location/distance';

const BASE_FARE = 4800; // 기본요금 (1.6km 까지)
const BASE_DISTANCE_KM = 1.6;
const FARE_PER_UNIT = 100; // 131m 마다 100원
const UNIT_DISTANCE_KM = 0.131;
const ROAD_RATIO = 1.3; // 직선거리 → 실제 도로 거리 보정
const NIGHT_SURCHARGE = 1.2; // 심야 할증 20%

// 서울 택시 요금 기준의 예상 심야 택시비 (100원 단위 반올림)
export const getTaxiFare = (departure: ILocation, arrival: ILocation) => {
  const roadKm =
    getDistanceKm(departure.x, departure.y, arrival.x, arrival.y) * ROAD_RATIO;
  const extraUnits = Math.max(0, roadKm - BASE_DISTANCE_KM) / UNIT_DISTANCE_KM;
  const fare = (BASE_FARE + extraUnits * FARE_PER_UNIT) * NIGHT_SURCHARGE;
  return Math.round(fare / 100) * 100;
};
