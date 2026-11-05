import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import icSignature from 'public/assets/icons/ic_signature.svg';
import icArrowBackBlack from 'public/assets/icons/ic_arrow_back_black.svg';
import { alarmState } from '@/recoil/alarm';

// 도착 확인 화면들의 공통 배치 (뒤로가기 → 문구 → 캐릭터 → 버튼)
export default function CompletedLayout({
  message,
  backHref,
  children,
}: {
  message: React.ReactNode;
  backHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const alarm = useRecoilValue(alarmState);

  // 알림을 건 경로가 없으면 택시비를 계산할 수 없으므로 홈으로 돌려보낸다
  useEffect(() => {
    if (!alarm) router.replace('/');
  }, [alarm, router]);

  return (
    <Container>
      <Header>
        <Link href={backHref}>
          <Image src={icArrowBackBlack} alt="뒤로가기" />
        </Link>
      </Header>
      <Message>{message}</Message>
      <Image src={icSignature} width={110} height={96} alt="막차타 캐릭터" />
      <Buttons>{children}</Buttons>
    </Container>
  );
}

const Container = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 16px 120px;
`;

// 다른 화면 헤더와 같은 높이(48px)로 왼쪽 위에 둔다
const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
`;

const Message = styled.div`
  margin-bottom: 40px;
  color: #242424;
  font-size: 18px;
  line-height: 26px;
  text-align: center;

  strong {
    font-weight: 700;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 88px;

  > button {
    flex: 1;
    padding: 13px 10px;
    border: 1px solid #ff8048;
    border-radius: 14px;
    background-color: #ff8048;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }

  /* 보조 버튼(아니요)은 흰 바탕에 회색 테두리 */
  > button[data-variant='secondary'] {
    border-color: #888;
    background-color: #fff;
    color: #888;
  }
`;
