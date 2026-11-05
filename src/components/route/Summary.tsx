'use client';

import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import BackBtn from '@/components/route/common/BackBtn';
import Map from '@/components/route/summary/Map';
import BottomSheet from '@/components/route/BottomSheet';

interface ISummary {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Summary({
  isBottomSheetOpen,
  setIsBottomSheetOpen,
}: ISummary) {
  return (
    <Container>
      <Header>
        <BackBtn isBottomSheetOpen={isBottomSheetOpen} />
        <p>
          경로 정보를
          <br />
          한눈에 보여줄게요!
        </p>
      </Header>
      <Map />
      <BottomSheet
        isBottomSheetOpen={isBottomSheetOpen}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
      />
    </Container>
  );
}

// 지도가 접힌 바텀시트 윗부분 바로 아래까지 오도록 그만큼만 아래 여백을 둔다.
// 접힌 바텀시트 높이 = 하단 고정 버튼(88px) + 시트 높이(100vh - 203px)의 15% (BottomSheet 참고),
// 시트 모서리가 둥글어 16px 은 지도와 겹치게 둔다
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: calc(88px + (100vh - 203px) * 0.15 - 16px);
`;

const Header = styled.header`
  padding: 0 16px;

  p {
    margin-bottom: 36px;
    color: #242424;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
  }
`;
