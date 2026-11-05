import {
  alarmRouteState,
  alarmSettingState,
  alarmState,
  completedPromptedState,
} from '@/recoil/alarm';
import { getAlarmProgress } from '@/utils/time/alarmTime';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Toast from '@/components/common/Toast';

const ONE_MINUTE = 60 * 1000;

export const AlarmCardComponent = () => {
  const alarmSettingTime = useRecoilValue(alarmSettingState);
  const alarm = useRecoilValue(alarmState);
  const alarmRoute = useRecoilValue(alarmRouteState);
  const [isPrompted, setIsPrompted] = useRecoilState(completedPromptedState);
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  const [isToastVisible, setIsToastVisible] = useState(false);

  // 화면을 열어둔 동안에도 남은 시간과 게이지가 줄어들도록 1분마다 다시 계산한다
  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), ONE_MINUTE);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!isToastVisible) return undefined;
    const timer = setTimeout(() => setIsToastVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  // 예전 버전에서 저장된 알림엔 막차 시간이 없을 수 있다
  const hasMakcha = alarm && Boolean(alarmRoute.lastBoardingTime);
  const { restHour, restMinute, progress, isPassed } = hasMakcha
    ? getAlarmProgress(
        alarmRoute.lastBoardingTime,
        new Date(alarmSettingTime),
        now
      )
    : { restHour: '00', restMinute: '00', progress: 0, isPassed: false };

  // 막차 시간이 지나면 도착 확인 화면으로 한 번만 보낸다 (뒤로가기로 돌아오면 다시 보내지 않는다)
  useEffect(() => {
    if (hasMakcha && isPassed && !isPrompted) {
      setIsPrompted(true);
      router.push('/completed');
    }
  }, [hasMakcha, isPassed, isPrompted, setIsPrompted, router]);

  const toggleAlarm = () => {
    // 알림을 끄는 건 도착 여부를 답하면서 끝나도록 도착 확인 화면으로 보낸다 (답하면 알림이 꺼진다)
    if (alarm) {
      router.push('/completed');
      return;
    }
    // 켤 경로가 없으니 경로부터 검색하라고 안내한다
    setIsToastVisible(true);
  };

  //게이지 기본 속성값
  const RADIUS = 50;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 둘레 길이
  // 알림이 꺼져 있으면 게이지를 비워 점만 보이게 한다
  const circleProgress = CIRCUMFERENCE * (1 - progress / 100);
  return (
    <>
      <AlarmCard $alarm={alarm}>
        <CardBody>
          <AlarmSetting>
            <StartingPoint $alarm={alarm.toString()}>
              출발지
              <span>
                {alarm === false
                  ? '출발지 설정하기'
                  : alarmRoute.departure?.location}
              </span>
            </StartingPoint>
            <Destination $alarm={alarm.toString()}>
              도착지
              <span>
                {alarm === false
                  ? '도착지 설정하기'
                  : alarmRoute.arrival?.location}
              </span>
            </Destination>
            <StartAlarm $alarm={alarm.toString()}>
              <p>출발 알림</p>
              <AlarmToggle $alarm={alarm.toString()}>
                <ToggleSwitch $alarm={alarm.toString()} onClick={toggleAlarm}>
                  {alarm === false ? 'OFF' : 'ON'}
                </ToggleSwitch>
              </AlarmToggle>
            </StartAlarm>
          </AlarmSetting>
          <AlarmGage>
            <svg
              className="circle_progress"
              width="120"
              height="120"
              viewBox="0 0 120 120"
            >
              <defs>
                <linearGradient
                  id="alarmGageGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#FFD9C9" />
                  <stop offset="100%" stopColor="#FF8048" />
                </linearGradient>
              </defs>
              <circle
                className="frame"
                cx="60"
                cy="60"
                r={RADIUS}
                strokeWidth="15"
                fill="transparent"
                stroke="#eee"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <circle
                className="bar"
                cx="60"
                cy="60"
                r={RADIUS}
                stroke={alarm === false ? '#aaa' : 'url(#alarmGageGradient)'}
                strokeWidth="15"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={circleProgress}
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <AlarmTimer $alarm={alarm.toString()}>
              {alarm === false ? '00:00' : `${restHour} : ${restMinute}`}
            </AlarmTimer>
          </AlarmGage>
        </CardBody>
        {/* 막차를 탔는지 직접 알리는 작은 버튼 (막차 시간이 지나면 자동으로도 이동한다) */}
        {alarm && (
          <ArrivalLink href="/completed">도착 여부 알리기 &gt;</ArrivalLink>
        )}
      </AlarmCard>
      {isToastVisible && (
        <Toast message="막차 경로를 검색하고 알림을 설정해주세요" />
      )}
    </>
  );
};

export default AlarmCardComponent;

// 알림이 켜지면 아래에 '도착 여부 알리기' 줄이 붙어 카드가 그만큼 길어진다 (메인 page.tsx 의 위쪽 여백과 맞춘다)
const AlarmCard = styled.div<{ $alarm: boolean }>`
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  background-color: #fff;
  padding: ${({ $alarm }) => ($alarm ? '29px 32px 12px' : '29px 32px')};
  margin: 16px auto;
  border-radius: 20px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
const CardBody = styled.div`
  display: flex;
  height: 110px;
`;

const ArrivalLink = styled(Link)`
  align-self: flex-end;
  margin-top: 8px;
  padding: 4px 0;
  color: #ff8048;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

const AlarmSetting = styled.div`
  width: calc(100% - 140px);
  margin-right: 16px;

  p {
    display: flex;
    align-items: center;
  }
`;
const StartingPoint = styled.p<{ $alarm: string }>`
  color: ${(props) => (props.$alarm === 'true' ? '#333' : '#ccc')};
  font-size: 14px;
  font-weight: 700;
  & span {
    font-weight: 300;
    padding-left: 8px;
    display: inline-block;
    width: 103px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  padding-bottom: 8px;
`;
const Destination = styled.p<{ $alarm: string }>`
  color: ${(props) => (props.$alarm === 'true' ? '#333' : '#ccc')};
  font-size: 14px;
  font-weight: 700;
  & span {
    font-weight: 300;
    padding-left: 8px;
    display: inline-block;
    width: 103px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  border-bottom: 1px solid #ccc;
  padding-bottom: 18px;
`;
const StartAlarm = styled.div<{ $alarm: string }>`
  color: ${(props) => (props.$alarm === 'true' ? '#333' : '#ccc')};
  display: flex;
  align-items: center;
  padding-top: 18px;
  & p {
    font-size: 14px;
    font-weight: 700;
    line-height: 26px;
  }
`;
const AlarmToggle = styled.div<{ $alarm: string }>`
  background-color: ${(props) =>
    props.$alarm === 'true' ? '#FFD9C9' : '#D9D9D9'};
  width: 58px;
  height: 26px;
  border-radius: 20px;
  margin-left: 10px;
`;
const ToggleSwitch = styled.button<{ $alarm: string }>`
  color: #fff;
  background-color: ${(props) =>
    props.$alarm === 'true' ? '#FF8048' : '#888'};
  border: none;
  width: 35px;
  height: 22px;
  border-radius: 20px;
  font-size: 12px;
  transform: ${(props) =>
    props.$alarm === 'true' ? 'translate(20px, 2px);' : 'translate(2px, 2px);'};
  transition: 0.3s;
`;
const AlarmGage = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
`;

const AlarmTimer = styled.p<{ $alarm: string }>`
  width: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  font-weight: 600;
  font-size: 24px;
  text-align: center;
  color: ${(props) => (props.$alarm === 'true' ? '#FF8048' : '#aaa')};
`;
