'use client';

import { useRouter } from 'next/navigation';
import CompletedLayout from '@/components/completed/CompletedLayout';

export default function Completed() {
  const router = useRouter();

  return (
    <CompletedLayout
      backHref="/"
      message={
        <>
          <strong>막차타</strong>고 집에 잘 도착했나요?
        </>
      }
    >
      <button
        type="button"
        data-variant="secondary"
        onClick={() => router.push('/completed/missed')}
      >
        아니요...
      </button>
      <button type="button" onClick={() => router.push('/completed/arrived')}>
        네 도착했어요!
      </button>
    </CompletedLayout>
  );
}
