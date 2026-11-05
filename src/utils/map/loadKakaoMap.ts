let kakaoMapLoader: Promise<void> | null = null;

// 카카오 지도 SDK 를 페이지에 한 번만 불러온다 (이미 불러오는 중이면 같은 Promise 를 돌려준다)
export const loadKakaoMap = () => {
  if (kakaoMapLoader) return kakaoMapLoader;

  kakaoMapLoader = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;
    script.onload = () => resolve();
    script.onerror = () => {
      // 실패하면 다음 진입 때 다시 시도할 수 있도록 비운다
      kakaoMapLoader = null;
      reject(new Error('카카오 지도 SDK 를 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  });

  return kakaoMapLoader;
};
