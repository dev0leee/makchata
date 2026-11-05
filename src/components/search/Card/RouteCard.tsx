'use client';

import styled from 'styled-components';
import icX from 'public/assets/icons/ic_x_lg.svg';
import Image from 'next/image';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  pathResultState,
  remainPathSelector,
  searchState,
} from '@/recoil/search';
import { useMounted } from '@/hooks/useMounted';
import { IPathPropsWithoutKey } from '@/type/search';
import { MouseEvent } from 'react';

const RouteCard = () => {
  const { isMounted } = useMounted();
  const [remainPath, setRemainPath] = useRecoilState(remainPathSelector);
  const pathResult = useSetRecoilState(pathResultState);
  const setSearch = useSetRecoilState(searchState);
  const showResult = ({ arrival, departure }: IPathPropsWithoutKey) => {
    setSearch({ departure: departure.location, arrival: arrival.location });
    pathResult({
      arrival: {
        location: arrival.location,
        address: arrival.address,
        x: arrival.x,
        y: arrival.y,
      },
      departure: {
        location: departure.location,
        address: departure.address,
        x: departure.x,
        y: departure.y,
      },
    });
  };
  const removePath = (id: string, e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setRemainPath(remainPath.filter((path) => path.id !== id));
  };

  // 최근 경로는 브라우저 저장값이라 마운트 후에만 그려야 서버 렌더 결과와 어긋나지 않는다
  if (!isMounted) return null;

  if (remainPath.length === 0) {
    return <EmptyMessage>이동 경로를 검색해보세요.</EmptyMessage>;
  }

  return (
    <List>
      <Title>최근 검색 경로</Title>
      {remainPath.map(({ id, arrival, departure }) => {
        return (
          <Container
            key={id}
            onClick={() => showResult({ arrival, departure })}
          >
            <Wrap>
              <Course>
                <p>
                  <span>출발지</span> {departure.location}
                </p>
                <p>
                  <span>도착지</span> {arrival.location}
                </p>
              </Course>
              <Image
                src={icX}
                alt="저장된 경로 삭제"
                onClick={(e) => removePath(id, e)}
              />
            </Wrap>
          </Container>
        );
      })}
    </List>
  );
};
export default RouteCard;

const EmptyMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #aaa;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
`;

const Title = styled.h2`
  margin-bottom: 4px;
  color: #888;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

const Container = styled.div`
  color: inherit;
  border: none;
  background: none;
  cursor: pointer;
`;

const Wrap = styled.article`
  width: 100%;
  padding: 16px 24px;
  gap: 88px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 14px;
  background: #f9f9f9;

  /* 누르는 동안 회색으로 바뀐다 */
  &:hover,
  &:active {
    background: #eee;
  }
`;

const Course = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 50px;
  p {
    text-align: left;
    margin: 0;
    padding-right: 50px;
  }
  span {
    font-weight: 600;
    padding-right: 10px;
  }
`;
