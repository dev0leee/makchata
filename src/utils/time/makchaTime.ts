// 막차 시간은 지하철이 'HHMM', 그 외가 'HH:MM' 형식이다 (mocks/mockServer.ts 참고)
export const parseBoardingTime = (time: string) => {
  const [hour, minute] = time.includes(':')
    ? time.split(':').map(Number)
    : [Number(time.slice(0, 2)), Number(time.slice(2, 4))];
  return { hour, minute };
};

export const toClockText = (time: string) => {
  const { hour, minute } = parseBoardingTime(time);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(hour)}:${pad(minute)}`;
};

// 새벽(4시 전) 막차를 전날 저녁에 설정했다면 다음 날 시각으로 본다
const LATE_NIGHT_HOUR = 4;

export const getMakchaDate = (time: string, settingTime: Date) => {
  const { hour, minute } = parseBoardingTime(time);
  const makcha = new Date(settingTime);
  makcha.setHours(hour, minute, 0, 0);
  if (hour < LATE_NIGHT_HOUR && settingTime.getHours() >= 12) {
    makcha.setDate(makcha.getDate() + 1);
  }
  return makcha;
};
