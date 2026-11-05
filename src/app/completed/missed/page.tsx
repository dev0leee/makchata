'use client';

import FareResult from '@/components/completed/FareResult';

export default function Missed() {
  return (
    <FareResult
      title="저런...! 오늘 내가 내야하는 예상 택시비는"
      suffix="이에요"
      buttonText="내 통장아 미안해"
    />
  );
}
