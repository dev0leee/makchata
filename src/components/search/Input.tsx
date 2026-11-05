import { getLocationSearchResults } from '@/utils/apis/path';
import useDebounce from '@/hooks/useDebounce';
import { addressesState, pathResultState, searchState } from '@/recoil/search';
import { EMPTY_LOCATION } from '@/constants/search';
import React, { ChangeEvent, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ISearchKey } from '@/type/search';
import styled from 'styled-components';

interface InputProps {
  inputType: ISearchKey;
  onClick: () => void;
}
const Input = ({ inputType, onClick }: InputProps) => {
  const [search, setSearch] = useRecoilState(searchState);
  const setAddresses = useSetRecoilState(addressesState);
  const [pathResult, setPathResult] = useRecoilState(pathResultState);
  const debounceValue = useDebounce(search, 500);
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setSearch({ ...search, [name]: value });
    // 글자를 고치면 선택돼 있던 장소는 더 이상 유효하지 않으므로 비워서 경로 결과 대신 장소 검색 결과를 보여준다
    setPathResult((prev) => ({ ...prev, [name]: EMPTY_LOCATION }));
  };

  const fetchSearchValue = async (searchKeyword: string) => {
    const response = await getLocationSearchResults(searchKeyword);
    return setAddresses(response);
  };

  // 자기 입력칸 값만 검색해야 다른 입력칸의 검색 결과가 늦게 와서 덮어쓰지 않는다.
  // 장소를 고른 직후(입력값 = 선택한 장소 이름)에는 다시 검색하지 않는다
  const keyword = debounceValue[inputType];
  const selectedLocation = pathResult[inputType].location;
  useEffect(() => {
    if (keyword.length > 0 && keyword !== selectedLocation) {
      fetchSearchValue(keyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  return (
    <>
      <SearchInput
        onChange={(e) => onChangeValue(e)}
        onClick={onClick}
        placeholder={
          inputType === 'arrival'
            ? '도착지를 입력해주세요'
            : '출발지를 입력해주세요'
        }
        name={inputType}
        type="text"
        value={inputType === 'arrival' ? search.arrival : search.departure}
      />
    </>
  );
};

export default Input;

const SearchInput = styled.input`
  display: flex;
  width: 290px;
  position: relative;
  padding: 10px 50px 10px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  border: 1px solid var(--Gray_aaaaaa, #aaa);
  background: var(--white, #fff);
  color: var(--Black, #242424);
  font-weight: 400;
  line-height: 20px;
  font-size: 14px;

  &:first-of-type {
    margin-bottom: 6px;
  }
  &:focus {
    outline: none;
    border: 1px solid var(--Primary01, #ff8048);
  }

  &::placeholder {
    color: var(--Gray_cccccc, #ccc);
    font-size: 14px;
    font-weight: 400;
  }
`;
