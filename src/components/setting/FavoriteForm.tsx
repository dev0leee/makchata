import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import icFlagOrange from 'public/assets/icons/ic_flag_orange.svg';
import { favoritesState } from '@/recoil/favorite';
import { IFavorite } from '@/type/favorite';
import { IAddressProps, ILocation } from '@/type/search';
import { getLocationSearchResults } from '@/utils/apis/path';
import useDebounce from '@/hooks/useDebounce';
import PlaceItem from '@/components/common/PlaceItem';

interface IFavoriteForm {
  // 수정할 즐겨찾기 (없으면 새로 추가)
  favorite?: IFavorite;
  onSaved: () => void;
}

export default function FavoriteForm({ favorite, onSaved }: IFavoriteForm) {
  const setFavorites = useSetRecoilState(favoritesState);
  const [name, setName] = useState(favorite?.name ?? '');
  const [keyword, setKeyword] = useState(favorite?.place.location ?? '');
  const [place, setPlace] = useState<ILocation | null>(favorite?.place ?? null);
  const [results, setResults] = useState<IAddressProps[]>([]);
  const debouncedKeyword = useDebounce(keyword, 500);

  // 장소를 고른 뒤(입력값 = 고른 장소 이름)에는 다시 검색하지 않는다
  useEffect(() => {
    if (!debouncedKeyword || debouncedKeyword === place?.location) {
      setResults([]);
      return;
    }
    getLocationSearchResults(debouncedKeyword).then((data) =>
      setResults(data ?? [])
    );
  }, [debouncedKeyword, place?.location]);

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPlace(null);
  };

  const selectPlace = ({ place_name, address_name, x, y }: IAddressProps) => {
    setPlace({
      location: place_name,
      address: address_name,
      x: Number(x),
      y: Number(y),
    });
    setKeyword(place_name);
    setResults([]);
  };

  const canSave = name.trim().length > 0 && place !== null;

  const save = () => {
    if (!canSave) return;
    if (favorite) {
      setFavorites((prev) =>
        prev.map((item) =>
          item.id === favorite.id ? { ...item, name: name.trim(), place } : item
        )
      );
    } else {
      setFavorites((prev) => [
        ...prev,
        { id: uuidv4(), name: name.trim(), place },
      ]);
    }
    onSaved();
  };

  return (
    <Container>
      <NameField>
        <Image src={icFlagOrange} alt="" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="명칭을 입력해주세요"
          maxLength={10}
        />
      </NameField>
      <PlaceInput
        value={keyword}
        onChange={onChangeKeyword}
        placeholder="장소, 주소를 입력해주세요"
        $isSelected={place !== null}
      />
      <Results>
        {results.map((result) => (
          <PlaceItem
            key={`${result.place_name}-${result.address_name}`}
            location={result.place_name}
            address={result.address_name}
            onSelect={() => selectPlace(result)}
          />
        ))}
      </Results>
      <SaveArea>
        <button type="button" onClick={save} disabled={!canSave}>
          저장하기
        </button>
      </SaveArea>
    </Container>
  );
}

const Container = styled.main`
  padding-top: 12px;
`;

const NameField = styled.label`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 16px;
  padding: 10px 12px;
  border-bottom: 1px solid #ccc;

  > input {
    flex: 1;
    border: none;
    outline: none;
    color: #242424;
    font-size: 14px;

    &::placeholder {
      color: #ccc;
    }
  }
`;

// 장소를 고르면 주황 테두리로 표시한다
const PlaceInput = styled.input<{ $isSelected: boolean }>`
  width: calc(100% - 32px);
  margin: 16px 16px 0;
  padding: 11px 24px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? '#ff8048' : '#aaa')};
  border-radius: 14px;
  outline: none;
  color: #242424;
  font-size: 14px;
  line-height: 20px;

  &:focus {
    border-color: #ff8048;
  }

  &::placeholder {
    color: #ccc;
  }
`;

// 마지막 결과가 하단 저장 버튼에 가려지지 않도록 아래 여백을 둔다
const Results = styled.div`
  padding-bottom: 100px;
`;

const SaveArea = styled.div`
  position: fixed;
  bottom: 0;
  width: 390px;
  padding: 21px 16px;
  background-color: #fff;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.08);

  > button {
    width: 100%;
    padding: 13px 10px;
    border: none;
    border-radius: 14px;
    background-color: #ff8048;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
`;
