import React from 'react';
import styled from 'styled-components';
import icCurrentLocation from 'public/assets/icons/ic_current_location.svg';
import { pathResultState, searchState } from '@/recoil/search';
import { useRecoilState } from 'recoil';
import Image from 'next/image';
import { getCurrentLocation } from '@/utils/apis/path';

const CurrentLocationButton = () => {
  const [searchValue, setSearchValue] = useRecoilState(searchState);
  const [pathResult, setPathResult] = useRecoilState(pathResultState);

  const onClickCurrentLocation = () => {
    const { geolocation } = navigator;
    let latitude = '';
    let longitude = '';
    geolocation.getCurrentPosition(async (position) => {
      latitude = position.coords.latitude.toString();
      longitude = position.coords.longitude.toString();
      await getCurrentLocation(latitude, longitude).then((res) => {
        // 현재 위치로 고른 출발지는 '내위치:' 를 붙여 구분한다
        const location = `내위치: ${res.location}`;
        setSearchValue({ ...searchValue, departure: location });
        setPathResult({
          ...pathResult,
          departure: {
            address: res.location,
            location,
            x: res.x,
            y: res.y,
          },
        });
      });
    });
  };

  return (
    <Button onClick={() => onClickCurrentLocation()}>
      <Image src={icCurrentLocation} alt="현재위치버튼" />
    </Button>
  );
};

export default CurrentLocationButton;

const Button = styled.button`
  position: absolute;
  right: 7%;
  cursor: pointer;
  border: none;
  background-color: transparent;
`;
