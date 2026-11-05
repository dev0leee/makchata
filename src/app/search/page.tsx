'use client';
import icX from 'public/assets/icons/ic_x_lg.svg';
import icExchange from 'public/assets/icons/ic_exchange.svg';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  addressesState,
  pathResultState,
  remainPathState,
  searchState,
} from '@/recoil/search';
import Input from '@/components/search/Input';
import ResultCards from '@/components/search/Card/ResultCards';
import CurrentLocationButton from '@/components/search/Button/CurrentLocationButton';
import Image from 'next/image';
import ChipButton from '@/components/search/Button/ChipButton';
import RouteCard from '@/components/search/Card/RouteCard';
import PlaceCard from '@/components/search/Card/PlaceCard';
import PreparingModal from '@/components/common/PreparingModal';

export default function SearchPage() {
  const addresses = useRecoilValue(addressesState);
  const [pathResult, setPathResult] = useRecoilState(pathResultState);
  const [inputType, setInputType] = useState('departure');
  const resetAddresses = useResetRecoilState(addressesState);
  const [remainPath, setRemainPath] = useRecoilState(remainPathState);
  const [search, setSearch] = useRecoilState(searchState);
  const [isPreparingModalOpen, setIsPreparingModalOpen] = useState(false);
  const openPreparingModal = () => setIsPreparingModalOpen(true);

  useEffect(() => {
    if (
      pathResult?.arrival?.address?.length !== 0 &&
      pathResult?.departure?.address?.length !== 0
    ) {
      resetAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  // addresses가 변할 때 실행되면 로컬스토리지에 addresses의 갯수만큼 저장됨.
  // 그렇기 때문에 deps에 보이는 것처럼 적어 놓음.
  useEffect(() => {
    if (
      pathResult?.arrival?.address?.length !== 0 &&
      pathResult?.departure?.address?.length !== 0
    ) {
      setRemainPath([...remainPath, pathResult]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathResult.arrival.address, pathResult.departure.address]);

  const changeSearchValue = () => {
    setSearch({ arrival: search.departure, departure: search.arrival });
  };

  // 입력값과 함께 선택된 장소도 비워야 이전 장소 기준의 경로 결과가 남지 않는다
  const deleteSearchValue = (type: 'departure' | 'arrival') => {
    setSearch({ ...search, [type]: '' });
    setPathResult({
      ...pathResult,
      [type]: { location: '', address: '', x: 0, y: 0 },
    });
    resetAddresses();
  };

  return (
    <Wrap>
      <Header>
        <Image
          src={icExchange}
          alt={'출발지, 도착지 교환'}
          onClick={() => changeSearchValue()}
          style={{ cursor: 'pointer' }}
        />
        <div>
          <InputWrap>
            <Input
              inputType="departure"
              onClick={() => setInputType('departure')}
            />
            <CurrentLocationButton />
          </InputWrap>
          <Input inputType="arrival" onClick={() => setInputType('arrival')} />
        </div>
        <ResetBox>
          <button type="button" onClick={() => deleteSearchValue('departure')}>
            <Image src={icX} alt="출발지 삭제 버튼" />
          </button>
          <button type="button" onClick={() => deleteSearchValue('arrival')}>
            <Image src={icX} alt="도착지 삭제 버튼" />
          </button>
        </ResetBox>
      </Header>
      <ButtonWrap>
        <article>
          {/* TODO: ICON SVG 수정, 즐겨찾기 기능 구현 전까지 준비중 모달 노출 */}
          <ChipButton text="우리집" onClick={openPreparingModal} />
          <ChipButton text="회사" onClick={openPreparingModal} />
          <ChipButton text="헬스장" onClick={openPreparingModal} />
        </article>
        {/* TODO: 즐겨찾기 스타일 수정 */}
        <ChipButton text="장소 즐겨찾기" onClick={openPreparingModal} />
      </ButtonWrap>
      {isPreparingModalOpen && (
        <PreparingModal onClose={() => setIsPreparingModalOpen(false)} />
      )}
      <ScrollArea className="hide-scroll">
        {/* input들에 value가 없으면서, localStorage에 value가 있을 때 */}
        {addresses?.length === 0 &&
          pathResult?.arrival?.address?.length === 0 &&
          pathResult?.departure?.address?.length === 0 && <RouteCard />}
        {addresses?.length > 0 &&
          addresses?.map(({ address_name, place_name, x, y }, index) => {
            return (
              <PlaceCard
                key={index}
                address={address_name}
                location={place_name}
                x={Number(x)}
                y={Number(y)}
                type={inputType}
              />
            );
          })}
        {pathResult?.arrival?.address?.length !== 0 &&
          pathResult?.departure?.address?.length !== 0 && <ResultCards />}
      </ScrollArea>
    </Wrap>
  );
}

// body 가 overflow: hidden 이라 화면 높이에 맞추고 결과 목록 영역만 스크롤되게 한다
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

// 마지막 항목이 하단 안내 문구에 가려지지 않도록 아래 여백을 둔다
const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 140px;
`;

const Header = styled.header`
  width: 100%;
  height: 151px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

// 입력창(높이 42px, 아래 여백 6px) 두 줄과 같은 높이로 맞춰 각 X 버튼을 해당 입력창 옆에 둔다
const ResetBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 6px;

  > button {
    display: flex;
    align-items: center;
    height: 42px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  background-color: #c7c7e8;
  display: inline-flex;
  padding: 10px 16px;
  align-items: center;
  gap: 63px;

  > article {
    width: 197px;
    gap: 8px;
    display: flex;
    align-items: center;
  }
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
