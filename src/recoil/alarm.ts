import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IAlarm, IAlarmRoute } from '@/type/alarm';
import { ALARM_TIME } from '@/constants/route';

const { persistAtom } = recoilPersist();

export const alarmState = atom({
  key: 'alarm',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const alarmSettingState = atom({
  key: 'alarmSetTime',
  default: new Date(),
  effects_UNSTABLE: [persistAtom],
});

// 메인 알림 카드에 표시할 출발지·도착지
export const alarmRouteState = atom<IAlarmRoute>({
  key: 'alarmRoute',
  default: { departure: '', arrival: '' },
  effects_UNSTABLE: [persistAtom],
});

export const vibrationPatternState = atom({
  key: 'vibrationPattern',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const alarmCheckedState = atom<IAlarm[]>({
  key: 'alarmChecked',
  default: ALARM_TIME.map((text) => ({ text, checked: false })),
  effects_UNSTABLE: [persistAtom],
});
