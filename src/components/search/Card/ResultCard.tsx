'use client';
import { pathResultState, selectedRouteState } from '@/recoil/search';
import { IResultProps } from '@/type/search';
import {
  formattingBoardingTime,
  formattingTimeTaken,
  formattingRemainTime,
} from '@/utils/time/boardingTime';
import Link from 'next/link';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const ResultCard = ({
  type,
  totalTime,
  totalDistance,
  subPath,
  index,
  lastBoardingTime,
}: IResultProps) => {
  const pathResult = useRecoilValue(pathResultState);
  const setSelectedRoute = useSetRecoilState(selectedRouteState);
  const [routeId] = useState(uuidv4);
  const formattingTime = formattingBoardingTime(lastBoardingTime, type);
  const formattingTaken = formattingTimeTaken(totalTime);
  const remainTime = formattingRemainTime(lastBoardingTime, totalTime, type);
  // 최근 검색 경로는 검색이 끝날 때 search 페이지에서 저장한다
  const savePath = () => {
    setSelectedRoute({
      id: routeId,
      index,
      type,
      lastBoardingTime,
      path: pathResult,
    });
  };

  // 자전거는 막차·경로 상세가 없어 거리와 소요시간만 보여준다
  if (type === '자전거') {
    return (
      <Wrap>
        <Header>
          <Type>{type}</Type>
          <Right>
            <p>
              거리 <span>{Math.round(totalDistance / 1000)}km</span>
            </p>
            <p>
              소요시간 <span>{formattingTaken}</span>
            </p>
          </Right>
        </Header>
      </Wrap>
    );
  }

  return (
    <Link
      prefetch={false}
      href={`/route/${routeId}`}
      onClick={() => savePath()}
    >
      <Wrap>
        <Header>
          <Type>{type}</Type>
          <Right>
            <p>
              막차시간 <span>{formattingTime}</span>
            </p>
            <p>
              소요시간 <span>{formattingTaken}</span>
            </p>
          </Right>
        </Header>
        <RouteBar>
          {/* 구간 길이 비율대로 나누고, 도보 구간은 비워 둔다 */}
          {subPath.map(({ distance, trafficType, sectionTime }, i) => (
            <Segment
              key={i}
              $ratio={distance / totalDistance}
              $trafficType={trafficType}
            >
              {trafficType !== '도보' && `${trafficType} ${sectionTime}분`}
            </Segment>
          ))}
        </RouteBar>
        <DepartureText>
          <span>{remainTime}</span> 뒤에 출발해야해요
        </DepartureText>
      </Wrap>
    </Link>
  );
};

export default ResultCard;

// 카드 사이를 두꺼운 회색 줄로 나눈다
const Wrap = styled.article`
  padding: 20px 16px 24px;
  border-bottom: 8px solid #f3f3f3;
  background-color: white;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 13px;

  > p {
    display: flex;
    align-items: center;
    height: 10px;
    padding: 0 8px;
  }

  > p:first-of-type {
    border-right: 1px solid #ccc;
  }

  > p:last-of-type {
    padding-right: 0;
  }

  span {
    padding-left: 4px;
    color: #242424;
    font-weight: 700;
  }
`;

const Type = styled.h1`
  color: #242424;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;

const RouteBar = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  height: 16px;
  margin: 20px 0 16px;
  border-radius: 100px;
  background: #eee;
  overflow: hidden;
`;

const SEGMENT_COLOR: { [key: string]: string } = {
  지하철: '#3cb44a',
  버스: '#f06e00',
};

const Segment = styled.div<{ $ratio: number; $trafficType: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: ${({ $ratio }) => $ratio};
  min-width: 0;
  border-radius: 100px;
  background-color: ${({ $trafficType }) =>
    SEGMENT_COLOR[$trafficType] ?? 'transparent'};
  color: white;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
`;

const DepartureText = styled.p`
  display: flex;
  justify-content: center;
  align-items: baseline;
  color: #242424;
  font-size: 14px;
  line-height: 20px;

  > span {
    padding-right: 2px;
    font-size: 24px;
    font-weight: 700;
    line-height: 34px;
  }
`;
