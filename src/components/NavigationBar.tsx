'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import icLocationOrange from 'public/assets/icons/ic_location_orange.svg';
import icSettingGray from 'public/assets/icons/ic_setting_gray.svg';
import icSettingOrange from 'public/assets/icons/ic_setting_orange.svg';
import icUserGray from 'public/assets/icons/ic_user_gray.svg';
import icUserOrange from 'public/assets/icons/ic_user_orange.svg';
import styled from 'styled-components';

const ACTIVE_COLOR = '#FF8048';
const INACTIVE_COLOR = '#BBBBBB';

export default function NavigationBar() {
  const activePath = usePathname();
  const isSetting = activePath.includes('/setting');
  // 검색 화면도 '막차 찾기' 흐름이라 같은 탭을 활성으로 표시한다
  const isHome = activePath === '/' || activePath === '/search';
  const isMyPage = activePath === '/mypage';

  // 레이아웃에서 한 번만 렌더링해 페이지 이동 시 다시 그려지지 않게 하고, 노출 여부는 경로로 정한다
  if (!isHome && !isSetting && !isMyPage) return null;

  return (
    <Container>
      <Link href="/setting" aria-label="설정 페이지로 이동">
        <NavLink $active={isSetting}>
          <Image src={isSetting ? icSettingOrange : icSettingGray} alt="" />
          <span>설정</span>
        </NavLink>
      </Link>
      <CircleWrapper>
        <Circle>
          <Link href="/">
            <NavLink $active={isHome}>
              <Image
                src={icLocationOrange}
                alt={'홈 화면으로 이동'}
                width={24}
                height={28}
              />
            </NavLink>
          </Link>
        </Circle>
      </CircleWrapper>
      <CircleText $active={isHome}>막차 찾기</CircleText>
      <Link href="/mypage" aria-label="마이 페이지로 이동">
        <NavLink $active={isMyPage}>
          <Image src={isMyPage ? icUserOrange : icUserGray} alt="" />
          <span>마이페이지</span>
        </NavLink>
      </Link>
    </Container>
  );
}

const Container = styled.nav`
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

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin-bottom: 50px;
  padding: 14px;
  border-radius: 50%;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.08);
`;

const CircleText = styled.span<{ $active: boolean }>`
  position: absolute;
  bottom: 30px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 18px;
  color: ${({ $active }) => ($active ? ACTIVE_COLOR : INACTIVE_COLOR)};
`;
