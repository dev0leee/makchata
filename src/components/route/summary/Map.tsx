'use client';

import { PathProps, PathDetailResponseProps } from '@/type/path';
import { useEffect } from 'react';
import styled from 'styled-components';
import { IPathProps } from '@/type/search';
import usePathDetailQuery from '@/hooks/usePathDetailQuery';
import useSelectedRoute from '@/hooks/useSelectedRoute';
import { EMPTY_PATH } from '@/constants/search';
import { loadKakaoMap } from '@/utils/map/loadKakaoMap';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

// 지도 띄우기 함수
const onLoadKakaoAPI = (
  selectedPathResult: IPathProps,
  pathDetailLocationList: PathProps[]
) => {
  window.kakao.maps.load(() => {
    // 초기 지도화면 생성
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        selectedPathResult.departure.y,
        selectedPathResult.departure.x
      ), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    // 지도 확대, 축소 이벤트
    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
      map.getLevel();
    });

    // 다중 마커 표시
    const positions = [
      {
        title: '출발지',
        latlng: new window.kakao.maps.LatLng(
          selectedPathResult.departure.y,
          selectedPathResult.departure.x
        ),
        src: 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/flagImg/blue_b.png',
      },
      {
        title: '도착지',
        latlng: new window.kakao.maps.LatLng(
          selectedPathResult.arrival.y,
          selectedPathResult.arrival.x
        ),
        src: 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/flagImg/red_b.png',
      },
    ];

    // 마커 이미지 크기
    const imageSize = new window.kakao.maps.Size(37, 42);

    // 지도 중심좌표 및 범위 재설정
    const bounds = new window.kakao.maps.LatLngBounds();

    for (const position of positions) {
      // 마커 이미지 생성
      const markerImage = new window.kakao.maps.MarkerImage(
        position.src,
        imageSize
      );

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        map, // 마커를 표시할 지도
        position: position.latlng, // 마커를 표시할 위치
        title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됨
        image: markerImage, // 마커 이미지
      });

      marker.setMap(map);
      bounds.extend(position.latlng);
    }

    map.setBounds(bounds);

    // 지도 경로 표시
    type LinePathsProps = {
      path: string[] | undefined;
      color: string;
    };
    const linePaths: LinePathsProps[] = [];
    const arrayExceptedWalkingPath = pathDetailLocationList.filter(
      (path) => path.trafficType !== '도보'
    );
    arrayExceptedWalkingPath.map((path) => {
      linePaths.push({
        path: path.coords?.map(
          (coord) => new window.kakao.maps.LatLng(coord.y, coord.x)
        ),
        color: path.trafficType === '버스' ? '#1954b3' : '#ffab24FF',
      });
    });

    linePaths.map((linePath) => {
      const polyline = new window.kakao.maps.Polyline({
        path: linePath.path,
        strokeWeight: 5,
        strokeColor: linePath.color,
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });

      polyline?.setMap(map);
    });
  });
};

export default function Map() {
  const selectedRoute = useSelectedRoute();
  const selectedPathResult = selectedRoute?.path ?? EMPTY_PATH;
  const {
    pathDetailLocations,
  }: { pathDetailLocations: PathDetailResponseProps } = usePathDetailQuery({
    sx: selectedPathResult.departure.x,
    sy: selectedPathResult.departure.y,
    ex: selectedPathResult.arrival.x,
    ey: selectedPathResult.arrival.y,
    index: selectedRoute?.index ?? 0,
  });

  useEffect(() => {
    // 근거리 등으로 경로 상세가 없으면 지도를 그리지 않는다
    if (!pathDetailLocations?.path) return;

    loadKakaoMap()
      .then(() => onLoadKakaoAPI(selectedPathResult, pathDetailLocations.path))
      .catch((error) => console.error(error));
  }, [pathDetailLocations, selectedPathResult]);

  return <Container id="map"></Container>;
}

// 고정 높이 대신 Summary 의 남은 영역을 모두 채운다
const Container = styled.div`
  z-index: 0;
  flex: 1;
  width: 390px;
`;
