// 두 좌표(x: 경도, y: 위도) 사이의 직선 거리(km). 하버사인 공식
export const getDistanceKm = (
  sx: number,
  sy: number,
  ex: number,
  ey: number
) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(ey - sy);
  const dLng = toRad(ex - sx);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(sy)) * Math.cos(toRad(ey)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
