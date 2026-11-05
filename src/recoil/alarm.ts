import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IAlarm, IAlarmRoute } from '@/type/alarm';
import { ALARM_TIME } from '@/constants/route';
import { EMPTY_LOCATION } from '@/constants/search';

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
  default: {
    departure: EMPTY_LOCATION,
    arrival: EMPTY_LOCATION,
    type: '',
    lastBoardingTime: '',
  },
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

// 막차 시간이 지나 도착 확인 화면으로 자동 이동했는지. 뒤로가기로 돌아왔을 때 다시 보내지 않으려고 쓴다
export const completedPromptedState = atom({
  key: 'completedPrompted',
  default: false,
});
