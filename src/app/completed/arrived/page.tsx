'use client';

import FareResult from '@/components/completed/FareResult';

export default function Arrived() {
  return (
    <FareResult
      title="오늘 내가 아낀 예상 택시비는"
      suffix="이에요!"
      buttonText="내 통장을 지켜줘서 고마워"
    />
  );
}
