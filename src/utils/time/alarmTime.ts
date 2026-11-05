import { getMakchaDate } from '@/utils/time/makchaTime';

const pad = (value: number) => String(value).padStart(2, '0');

// 알림을 켠 시각부터 막차 시각까지 중 지금 얼마나 지났는지와 남은 시간을 계산한다
export const getAlarmProgress = (
  lastBoardingTime: string,
  settingTime: Date,
  now = new Date()
) => {
  const makcha = getMakchaDate(lastBoardingTime, settingTime).getTime();
  const restMs = Math.max(0, makcha - now.getTime());
  const totalMs = makcha - settingTime.getTime();
  const restMinutes = Math.ceil(restMs / (1000 * 60));

  return {
    restHour: pad(Math.floor(restMinutes / 60)),
    restMinute: pad(restMinutes % 60),
    // 게이지는 지난 비율(0~100)
    progress:
      totalMs > 0 ? Math.min(100, ((totalMs - restMs) / totalMs) * 100) : 100,
    isPassed: restMs === 0,
  };
};
