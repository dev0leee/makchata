import React from 'react';
import mock from '@/mocks/detailRouteMockData.json';
import styled from 'styled-components';
import { subwayColor } from '@/constants/routeColor';
import { toClockText } from '@/utils/time/makchaTime';

interface DetailRouteProps {
  type: string;
  lastBoardingTime: string;
  startName?: string;
  endName?: string;
}

// 상세 목데이터의 pathType (1: 지하철, 2: 버스, 3: 지하철+버스) 중 고른 경로 종류와 같은 첫 경로를 쓴다
const PATH_TYPE: Record<string, number> = {
  지하철: 1,
  버스: 2,
  '지하철+버스': 3,
};
const findMockPath = (type: string) =>
  mock.result.path.find(({ pathType }) => pathType === PATH_TYPE[type]) ??
  mock.result.path[0];

// 막차 시각에 출발해 총 소요시간을 더해 도착 시간을 만든다
const addMinutes = (time: string, minutes: number) => {
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + minutes;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const DetailRoute: React.FC<DetailRouteProps> = ({
  type,
  lastBoardingTime,
  startName,
  endName,
}) => {
  const { subPath, info } = findMockPath(type);
  const startTime = lastBoardingTime ? toClockText(lastBoardingTime) : '--:--';
  return (
    <RouteWrapper>
      <StartPoint>
        <span>{startTime}</span>
        {startName ?? info.firstStartStation}
      </StartPoint>
      {subPath.map((step: any, idx: number) => {
        switch (step.trafficType) {
          case 1: {
            // Subway
            const line = step.lane && step?.lane[0]?.subwayCode;
            const lineName = (
              <LineName $color={`#${subwayColor[line] ?? '242424'}`}>
                {line}호선
              </LineName>
            );
            return (
              <SubwayStep key={idx} $line={line}>
                <StepIcons $trafficType="sub" $line={line} />
                <RidingStep>
                  {lineName} {step.startName}역 승차
                </RidingStep>
                <StepTrans>
                  <Highlight>{step.sectionTime}분</Highlight>
                  {[
                    step.way && `${step.way} 방면`,
                    step.door &&
                      step.door !== 'null' &&
                      `빠른환승 ${step.door}`,
                  ]
                    .filter(Boolean)
                    .map((text) => (
                      <Detail key={text}>{text}</Detail>
                    ))}
                </StepTrans>
                <QuitStepIcons $trafficType="sub" $line={line} />
                <QuitStep>
                  {lineName} {step.endName}역 하차
                </QuitStep>
                <SectionTime>{step.sectionTime}분</SectionTime>
              </SubwayStep>
            );
          }
          case 2: // Bus
            return (
              <BusStep key={idx}>
                <StepIcons $trafficType="bus" $line="1" />
                <RidingStep>{step?.busNo}</RidingStep>
                <StepTrans>{step.startName}</StepTrans>
                <QuitStep>{step.endName}</QuitStep>
                <SectionTime>{step.sectionTime}분</SectionTime>
              </BusStep>
            );
          case 3: {
            // Walk (환승처럼 이동 거리가 0 인 도보 구간은 표시하지 않는다)
            if (step.distance === 0) return null;
            const next: any = subPath[idx + 1];
            const destination = next
              ? `${next.startName}${next.trafficType === 1 ? '역' : '정류장'}${
                  next.startExitNo ? ` ${next.startExitNo}번 출구` : ''
                }`
              : '도착지';
            return (
              <WalkStep key={idx}>
                <p>
                  {destination}까지 도보 <strong>{step.distance}m</strong>
                </p>
                <SectionTime>{step.sectionTime}분</SectionTime>
              </WalkStep>
            );
          }
          default:
            return null;
        }
      })}
      <EndPoint>
        <span>
          {lastBoardingTime ? addMinutes(startTime, info.totalTime) : '--:--'}
        </span>
        {endName ?? info.lastEndStation}
      </EndPoint>
    </RouteWrapper>
  );
};

export default DetailRoute;

const RouteWrapper = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  padding-bottom: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  & p {
    width: 100%;
  }
`;

const StartPoint = styled.p`
  position: relative;
  width: calc(100% - 78px);
  margin-left: 78px;
  line-height: 42px;
  font-weight: 700;
  &::before {
    position: absolute;
    top: 50%;
    left: -40px;
    transform: translateY(-50%);
    content: '';
    display: inline-block;
    background: url('/assets/icons/ic_directionStart_gray.svg');
    width: 42px;
    height: 42px;
  }
  & span {
    position: absolute;
    top: 50%;
    left: -78px;
    transform: translateY(-50%);
  }
`;

const EndPoint = styled.p`
  position: relative;
  width: calc(100% - 78px);
  margin-left: 78px;
  line-height: 42px;
  font-weight: 700;
  &::before {
    position: absolute;
    top: 50%;
    left: -40px;
    transform: translateY(-50%);
    content: '';
    display: inline-block;
    background: url('/assets/icons/ic_directionEnd_gray.svg');
    width: 42px;
    height: 42px;
  }
  & span {
    position: absolute;
    top: 50%;
    left: -78px;
    transform: translateY(-50%);
  }
`;

const SubwayStep = styled.div<{ $line: number }>`
  position: relative;
  // height: 88px;
  border-left: ${(props) => `solid 3px #${subwayColor[props.$line] || '000'}`};
  margin-left: 58px;
  & p {
    padding-left: 21px;
    position: relative;
  }
`;
const BusStep = styled.div`
  position: relative;
  margin-left: 58px;
  line-height: 42px;
  & p {
    padding-left: 21px;
  }
`;

const StepIcons = styled.div<{ $trafficType: string; $line: string }>`
  position: relative;
  width: 25px;
  height: 25px;
  left: -12px;
  background-color: ${(props) =>
    props.$trafficType === 'sub'
      ? `#${subwayColor[props.$line]}`
      : `#${props.$line}`};

  z-index: 1;
  border-radius: 20px;

  &::after {
    position: absolute;
    top: 4px;
    left: 4px;
    content: '';
    background: ${(props) =>
      `url('/assets/icons/ic_${props.$trafficType}_white.svg')`};
    background-repeat: no-repeat;
    width: 23px;
    height: 23px;
  }
`;

const QuitStepIcons = styled.div<{ $trafficType: string; $line: string }>`
  position: relative;
  width: 25px;
  height: 25px;
  left: -12px;
  bottom: -21px;
  background-color: ${(props) =>
    props.$trafficType === 'sub'
      ? `#${subwayColor[props.$line]}`
      : `#${props.$line}`};

  z-index: 1;
  border-radius: 20px;
  &::after {
    position: absolute;
    top: 6px;
    left: 4px;
    content: '하차';
    color: #fff;
    font-size: 10px;
  }
`;

const RidingStep = styled.p`
  position: relative;
  bottom: 21px;
`;
const QuitStep = styled.p`
  position: relative;
  bottom: 0;
`;

const StepTrans = styled.p`
  color: #666;
`;

// 노선 이름은 노선 색으로 강조한다
const LineName = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: 700;
`;

const Highlight = styled.span`
  color: #ff8048;
`;

// 상세 정보 사이를 세로 구분선으로 나눈다
const Detail = styled.span`
  &::before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 10px;
    margin: 0 6px;
    background-color: #ccc;
  }
`;

const WalkStep = styled.div`
  position: relative;
  margin-left: 58px;
  padding: 20px 0;
  border-left: 2px dashed #bbb;
  line-height: 42px;
  & p {
    padding-left: 21px;
  }
`;

const SectionTime = styled.span`
  position: absolute;
  top: 50%;
  left: -60px;
  transform: translateY(-50%);
`;
