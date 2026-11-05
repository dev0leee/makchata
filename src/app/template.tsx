'use client';

import styled, { keyframes } from 'styled-components';

// template 은 페이지 이동마다 새로 마운트되므로 진입 애니메이션을 걸기 좋다
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// transform 을 쓰면 하위의 position: fixed 요소(네비게이션 바 등)의 기준이 바뀌어 opacity 만 사용한다
const PageTransition = styled.div`
  animation: ${fadeIn} 0.25s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
