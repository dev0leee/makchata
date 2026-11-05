import Image from 'next/image';
import styled from 'styled-components';
import icLocation from 'public/assets/icons/ic_location.svg';

interface IPlaceItem {
  location: string;
  address: string;
  onSelect: () => void;
}

// 장소 검색 결과 한 줄 (검색 화면·즐겨찾기 관리에서 함께 쓴다)
export default function PlaceItem({ location, address, onSelect }: IPlaceItem) {
  return (
    <Container type="button" onClick={onSelect}>
      <Image src={icLocation} alt="" />
      <TitleWrap>
        <p>{location}</p>
        <p>{address}</p>
      </TitleWrap>
    </Container>
  );
}

// 누르는 동안 회색으로 바뀐다
const Container = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px 8px;
  border: none;
  border-bottom: 1px solid #eee;
  background: #fff;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: #eee;
  }
`;

const TitleWrap = styled.div`
  font-size: 14px;

  > p:first-of-type {
    margin-bottom: 8px;
    color: #242424;
    font-weight: 600;
  }

  > p:last-of-type {
    color: #888;
  }
`;
