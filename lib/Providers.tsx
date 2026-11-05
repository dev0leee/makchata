'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
import styled from 'styled-components';
import useTempMockData from '@/hooks/useTempMockData';

type Props = {
  children: React.ReactNode;
};

function Providers({ children }: Props) {
  const { noticeMessage } = useTempMockData();

  const [client] = React.useState(
    new QueryClient({
      defaultOptions: {
        // react-query 전역 설정
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    })
  );

  return (
    <RecoilRoot>
      <QueryClientProvider client={client}>
        {children}
        <MockNotice>{noticeMessage}</MockNotice>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default Providers;

// 하단에 고정된 네비게이션 바(88px)와 겹치지 않도록 그 위에 띄운다
const MockNotice = styled.p`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  padding: 4px 12px;
  border-radius: 100px;
  background-color: rgba(36, 36, 36, 0.7);
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  pointer-events: none;
`;
