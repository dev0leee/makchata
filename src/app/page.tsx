'use client';
import Image from 'next/image';
import styled from 'styled-components';
import icExclamationMarkGray from 'public/assets/icons/ic_exclamationMark_gray.svg';
import icSignature from 'public/assets/icons/ic_signature.svg';
import DetailRoute from '@/components/main/DetailRoute';
import AlarmCardComponent from '@/components/main/AlarmCard';
import { useRecoilState, useRecoilValue } from 'recoil';
import { alarmRouteState, alarmState } from '@/recoil/alarm';
import { useMounted } from '@/hooks/useMounted';
import Link from 'next/link';

export default function Home() {
  const [alarm] = useRecoilState(alarmState);
  const alarmRoute = useRecoilValue(alarmRouteState);
  // 알림 상태는 브라우저 저장값이라 서버 렌더 결과와 어긋나지 않도록 마운트 후에 그린다
  const { isMounted } = useMounted();
  return (
    <Container>
      <TitleWrapper>
        <Title>
          <span>막차타</span>랑 같이
          <br />
          막차타요
        </Title>
        <Image
          src={icSignature}
          width={110}
          height={96}
          alt="막차타일러스트"
          priority
        />
      </TitleWrapper>
      <ContentWrapper $alarm={isMounted && alarm}>
        {/* 알림이 꺼져 있어도 같은 카드를 OFF 상태로 보여준다 */}
        {isMounted && <AlarmCardComponent />}
        <RouteWrap $hasRoute={isMounted && alarm}>
          {isMounted && alarm === false && (
            <InfoBox>
              <Image src={icExclamationMarkGray} alt="" priority />
              <p>막차 경로를 설정해주세요</p>
              <SearchLink href="/search">경로 검색하기</SearchLink>
            </InfoBox>
          )}
          {isMounted && alarm && (
            <>
              <h3>오늘 꼭 타야하는 막차 경로</h3>
              <DetailRoute
                type={alarmRoute.type}
                lastBoardingTime={alarmRoute.lastBoardingTime}
                startName={alarmRoute.departure?.location || undefined}
                endName={alarmRoute.arrival?.location || undefined}
              />
            </>
          )}
        </RouteWrap>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #ffd9c9;
  color: #242424;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 69px 16px 0;
`;

const Title = styled.h1`
  font-weight: 300;
  & > span {
    font-weight: 700;
  }
`;

// 알림이 켜지면 카드가 '도착 여부 알리기' 줄(약 19px)만큼 길어져 그만큼 내용을 내린다
const ContentWrapper = styled.div<{ $alarm: boolean }>`
  position: relative;
  top: 100px;
  width: 100%;
  height: calc(100% - 265px);
  border-radius: 20px 20px 0 0;
  background-color: #fff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding-top: ${({ $alarm }) => ($alarm ? '135px' : '116px')};
  padding-bottom: 88px;
`;

// 경로가 있을 때만 왼쪽 여백을 둬서, 빈 화면 안내는 가운데에 오게 한다
const RouteWrap = styled.div<{ $hasRoute: boolean }>`
  padding-left: ${({ $hasRoute }) => ($hasRoute ? '16px' : '0')};
  height: 100%;
  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 84px;
  & img {
    margin-bottom: 14px;
  }
  & p {
    color: #aaa;
    font-weight: 300;
  }
`;

const SearchLink = styled(Link)`
  margin-top: 24px;
  padding: 13px 32px;
  border-radius: 14px;
  background-color: #ff8048;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;
