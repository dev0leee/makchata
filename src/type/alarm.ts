import { ILocation } from '@/type/search';

export interface IAlarm {
  text: string;
  checked: boolean;
}

// 알림을 설정한 경로. 택시비 계산에 좌표를, 남은 시간 계산에 막차 시간을 쓴다
export interface IAlarmRoute {
  departure: ILocation;
  arrival: ILocation;
  type: string;
  lastBoardingTime: string;
}
