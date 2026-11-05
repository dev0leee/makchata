'use client';
import icCloseGray from 'public/assets/icons/ic_close_gray.svg';
import icSetting from 'public/assets/icons/ic_setting.svg';
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
import { EMPTY_LOCATION } from '@/constants/search';
import { ISearchKey } from '@/type/search';
import { IFavorite } from '@/type/favorite';
import { favoritesState } from '@/recoil/favorite';
import { getFavoriteIcon } from '@/utils/favorite/getFavoriteIcon';
import { useRouter } from 'next/navigation';
import { addRecentPath } from '@/utils/search/addRecentPath';
import { useMounted } from '@/hooks/useMounted';

export default function SearchPage() {
  const addresses = useRecoilValue(addressesState);
  const [pathResult, setPathResult] = useRecoilState(pathResultState);
  const [inputType, setInputType] = useState<ISearchKey>('departure');
  const resetAddresses = useResetRecoilState(addressesState);
  const [remainPath, setRemainPath] = useRecoilState(remainPathState);
  const [search, setSearch] = useRecoilState(searchState);
  const favorites = useRecoilValue(favoritesState);
  const router = useRouter();
  // 즐겨찾기는 브라우저 저장값이라 서버 렌더 결과와 어긋나지 않도록 마운트 후에 그린다
  const { isMounted } = useMounted();

  // 즐겨찾기 칩을 누르면 도착지로 넣는다
  const selectFavorite = ({ place }: IFavorite) => {
    setSearch({ ...search, arrival: place.location });
    setPathResult({ ...pathResult, arrival: place });
    resetAddresses();
  };

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
      setRemainPath(addRecentPath(remainPath, pathResult));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathResult.arrival.address, pathResult.departure.address]);

  // 입력 글자와 선택된 장소를 같이 바꿔야 경로 결과도 반대 방향으로 다시 나온다
  const changeSearchValue = () => {
    setSearch({ arrival: search.departure, departure: search.arrival });
    setPathResult({
      arrival: pathResult.departure,
      departure: pathResult.arrival,
    });
  };

  // 입력값과 함께 선택된 장소도 비워야 이전 장소 기준의 경로 결과가 남지 않는다
  const resetSearchValue = (key: ISearchKey) => {
    setSearch((prev) => ({ ...prev, [key]: '' }));
    setPathResult((prev) => ({ ...prev, [key]: EMPTY_LOCATION }));
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
        <ResetButtons>
          <button type="button" onClick={() => resetSearchValue('departure')}>
            <Image src={icCloseGray} alt="출발지 지우기" />
          </button>
          <button type="button" onClick={() => resetSearchValue('arrival')}>
            <Image src={icCloseGray} alt="도착지 지우기" />
          </button>
        </ResetButtons>
      </Header>
      <ButtonWrap>
        <article className="hide-scroll">
          {isMounted &&
            favorites.map((favorite) => (
              <ChipButton
                key={favorite.id}
                text={favorite.name}
                icon={getFavoriteIcon(favorite.name)}
                selected={
                  pathResult.arrival.location === favorite.place.location
                }
                onClick={() => selectFavorite(favorite)}
              />
            ))}
        </article>
        <ChipButton
          text="장소 즐겨찾기"
          icon={icSetting}
          variant="outline"
          onClick={() => router.push('/setting/favorites')}
        />
      </ButtonWrap>
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

// 출발지·도착지 입력창 줄에 하나씩 맞춰 둔다 (입력창 높이 42px, 사이 간격 6px)
const ResetButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f5f5f5;

  /* 즐겨찾기가 많으면 가로로 스크롤한다 */
  > article {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
  }
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
