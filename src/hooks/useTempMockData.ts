/**
 * 서버 운영 종료로 인한 임시 목데이터 모드.
 * window.fetch 를 감싸서 utils/apis/path.ts 가 보내는 API 요청만 목 응답으로 돌려준다.
 * 서버가 복구되면 이 훅을 호출하는 곳만 지우면 원래대로 동작한다.
 */
import { MOCK_DELAY, MOCK_NOTICE_MESSAGE } from '@/mocks/mockConstants';
import { TFetch } from '@/type/mock';
import { handleMockRequest } from '@/mocks/mockServer';

// utils/apis/path.ts 와 같은 방식으로 만들어야 환경변수가 없을 때('undefined')도 같은 접두사가 된다
const API_BASE = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}`;

let originalFetch: TFetch | null = null;

const mockFetch: TFetch = async (input, init) => {
  const url = input instanceof Request ? input.url : String(input);
  const result = url.startsWith(API_BASE)
    ? handleMockRequest(url.slice(API_BASE.length))
    : undefined;

  // 목 API 요청이 아니면(Next.js 내부 요청 등) 원래 fetch 로 보낸다
  if (result === undefined) return originalFetch!(input, init);

  await new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY);
  });
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

const useTempMockData = () => {
  // 하위 컴포넌트의 effect 가 요청을 보내기 전에 교체되도록 effect 가 아닌 렌더 시점에 설치한다
  if (typeof window !== 'undefined' && window.fetch !== mockFetch) {
    originalFetch = window.fetch.bind(window);
    // 전역 fetch 타입은 DOM 과 Node(undici) 오버로드가 합쳐져 있어 브라우저 시그니처로 맞춰 넣는다
    window.fetch = mockFetch as typeof window.fetch;
  }

  return { noticeMessage: MOCK_NOTICE_MESSAGE };
};

export default useTempMockData;
