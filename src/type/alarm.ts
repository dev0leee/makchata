export interface IAlarm {
  text: string;
  checked: boolean;
}

// 알림을 설정한 경로의 출발지·도착지 이름
export interface IAlarmRoute {
  departure: string;
  arrival: string;
}
