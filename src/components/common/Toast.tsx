import Image from 'next/image';
import styled from 'styled-components';
import icCheckWhite from 'public/assets/icons/ic_check_white.svg';

// 하단 탭바 바로 위에 잠깐 띄우는 안내 (미개발 기능 안내 등)
export default function Toast({ message }: { message: string }) {
  return (
    <Container role="status">
      <Image src={icCheckWhite} alt="" />
      {message}
    </Container>
  );
}

const Container = styled.div`
  z-index: 30;
  position: fixed;
  bottom: 104px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 358px;
  height: 56px;
  border-radius: 14px;
  background-color: #888;
  color: #fff;
  font-size: 15px;
  line-height: 22px;
`;
