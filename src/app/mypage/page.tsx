'use client';

import styled from 'styled-components';
import PreparingNotice from '@/components/common/PreparingNotice';

export default function MyPage() {
  return (
    <>
      <Container>
        <Title>마이페이지</Title>
        <main>
          <PreparingNotice />
        </main>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 390px;
  padding: 0 16px;
  > main {
    padding-top: 160px;
  }
`;

const Title = styled.h1`
  padding-top: 26px;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
`;
