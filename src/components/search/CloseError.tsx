import Image from 'next/image';
import styled from 'styled-components';
import icExclamationMarkGray from 'public/assets/icons/ic_exclamationMark_gray.svg';

const CloseError = () => {
  return (
    <Container>
      <Image src={icExclamationMarkGray} alt="" />
      <Title>출발지와 도착지가 너무 가까워요</Title>
      <Message>두 장소 사이의 거리가 700m 이내예요.</Message>
    </Container>
  );
};

export default CloseError;

// 검색 결과 영역(ScrollArea) 안에서 가로·세로 가운데에 둔다
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;

  > img {
    margin-bottom: 16px;
  }
`;

const Title = styled.p`
  margin-bottom: 4px;
  color: #444;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
`;

const Message = styled.p`
  color: #aaa;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
`;
