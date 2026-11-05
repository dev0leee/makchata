import Image from 'next/image';
import styled from 'styled-components';
import icCharCrying from 'public/assets/icons/ic_char_crying.svg';

export default function PreparingNotice() {
  return (
    <Container>
      <Image src={icCharCrying} width={110} height={96} alt="준비중 캐릭터" />
      <Title>해당 기능은 준비중이에요</Title>
      <Message>
        열심히 개발중이니
        <br />
        조금만 더 기다려 주세요!
      </Message>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  color: #242424;
`;

const Message = styled.p`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #888888;
`;
