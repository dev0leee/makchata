'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import icHomeGray from 'public/assets/icons/ic_home_gray.svg';
import icHomeOrange from 'public/assets/icons/ic_home_orange.svg';
import icSettingGray from 'public/assets/icons/ic_setting_gray.svg';
import icSettingOrange from 'public/assets/icons/ic_setting_orange.svg';
import icUserGray from 'public/assets/icons/ic_user_gray.svg';
import styled from 'styled-components';
import Toast from '@/components/common/Toast';

const ACTIVE_COLOR = '#FF8048';
const INACTIVE_COLOR = '#BBBBBB';

export default function NavigationBar() {
  const activePath = usePathname();
  const isSetting = activePath.includes('/setting');
  // 검색 화면도 '막차 찾기' 흐름이라 같은 탭을 활성으로 표시한다
  const isHome = activePath === '/' || activePath === '/search';
  // 즐겨찾기 관리는 하단에 저장 버튼이 있어 탭바를 숨긴다
  const isFavorites = activePath.startsWith('/setting/favorites');
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!isToastVisible) return undefined;
    const timer = setTimeout(() => setIsToastVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  // 레이아웃에서 한 번만 렌더링해 페이지 이동 시 다시 그려지지 않게 하고, 노출 여부는 경로로 정한다
  if ((!isHome && !isSetting) || isFavorites) return null;

  return (
    <Container>
      <Link href="/setting" aria-label="설정 페이지로 이동">
        <NavLink $active={isSetting}>
          <Image src={isSetting ? icSettingOrange : icSettingGray} alt="" />
          <span>설정</span>
        </NavLink>
      </Link>
      <Link href="/" aria-label="홈 화면으로 이동">
        <NavLink $active={isHome}>
          <Image src={isHome ? icHomeOrange : icHomeGray} alt="" />
          <span>홈</span>
        </NavLink>
      </Link>
      {/* 마이페이지는 아직 준비 중이라 이동 대신 안내 토스트를 띄운다 */}
      <MyPageButton type="button" onClick={() => setIsToastVisible(true)}>
        <NavLink $active={false}>
          <Image src={icUserGray} alt="" />
          <span>마이페이지</span>
        </NavLink>
      </MyPageButton>
      {isToastVisible && (
        <Toast message="마이페이지는 곧 서비스 될 예정이에요" />
      )}
    </Container>
  );
}

// 탭바 안의 토스트가 데모 안내 문구(z-index 5)보다 위에 보이도록 탭바를 위로 올린다
const Container = styled.nav`
  z-index: 10;
  position: fixed;
  bottom: 0;
  width: 390px;
  height: 88px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 64px 32px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.08);
`;

const NavLink = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > span {
    position: absolute;
    bottom: -18px;
    white-space: nowrap;
    font-size: 12px;
    line-height: 18px;
    color: ${({ $active }) => ($active ? ACTIVE_COLOR : INACTIVE_COLOR)};
  }
`;

const MyPageButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;
