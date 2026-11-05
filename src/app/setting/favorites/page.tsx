'use client';

import Link from 'next/link';
import styled from 'styled-components';
import ArrowIcon from '../ArrowIcon';
import PreparingNotice from '@/components/common/PreparingNotice';

export default function FavoritesSetting() {
  return (
    <>
      <Header>
        <Link href="/setting">
          <ArrowIcon color="#242424" />
        </Link>
        <Title>즐겨찾기 관리</Title>
      </Header>
      <Container>
        <PreparingNotice />
      </Container>
    </>
  );
}

const Header = styled.header`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  > :first-child {
    position: absolute;
    left: 16px;
    rotate: 180deg;
  }
`;

const Container = styled.main`
  padding-top: 160px;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
`;
