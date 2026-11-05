'use client';

import styled from 'styled-components';
import Summary from '@/components/route/Summary';
import AlarmModal from '@/components/route/AlarmModal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSelectedRoute from '@/hooks/useSelectedRoute';

export default function Page() {
  const router = useRouter();
  const selectedRoute = useSelectedRoute();
  // 검색 결과에서 고르지 않은 경로 주소(만료된 uuid 등)로 들어오면 검색부터 다시 하게 한다
  useEffect(() => {
    if (!selectedRoute) router.replace('/search');
  }, [selectedRoute, router]);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  // 처음엔 지도가 보이도록 접어두고, 알림 모달을 열 때도 접어서 모달이 겹치지 않게 한다
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleAlarmBtn = () => {
    setIsBottomSheetOpen(false);
    setIsAlarmModalOpen(true);
  };

  return (
    <Container>
      <Summary
        isBottomSheetOpen={isBottomSheetOpen}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
      />
      <FixedBtn>
        <button type="button" onClick={handleAlarmBtn}>
          이 경로로 알림 설정하기
        </button>
      </FixedBtn>
      {isAlarmModalOpen && (
        <AlarmModal setIsAlarmModalOpen={setIsAlarmModalOpen} />
      )}
    </Container>
  );
}

const Container = styled.div`
  button {
    border: none;
    outline: none;
    cursor: pointer;
  }

  li {
    list-style: none;
  }

  color: #242424;
`;

const FixedBtn = styled.div`
  z-index: 20;
  position: fixed;
  bottom: 0;

  width: 390px;
  /* 버튼(46px)을 88px 영역의 세로 가운데에 둔다 (높이 88px 는 바텀시트 위치 계산에 쓰인다) */
  padding: 21px 16px;
  background-color: #fff;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.08);

  button {
    width: 100%;
    border-radius: 14px;
    padding: 13px 10px;
    background-color: #ff8048;

    color: #fff;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
  }
`;
