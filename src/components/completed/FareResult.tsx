import { useRouter } from 'next/navigation';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import CompletedLayout from '@/components/completed/CompletedLayout';
import { alarmRouteState, alarmState } from '@/recoil/alarm';
import { useMounted } from '@/hooks/useMounted';
import { getTaxiFare } from '@/utils/fare/getTaxiFare';

interface IFareResult {
  title: string;
  suffix: string;
  buttonText: string;
}

// 알림 경로 기준 예상 택시비를 보여주고, 확인하면 알림을 끝내고 홈으로 간다
export default function FareResult({ title, suffix, buttonText }: IFareResult) {
  const router = useRouter();
  const alarmRoute = useRecoilValue(alarmRouteState);
  const setAlarm = useSetRecoilState(alarmState);
  const resetAlarmRoute = useResetRecoilState(alarmRouteState);
  // 알림 경로는 브라우저 저장값이라 마운트 후에 금액을 그린다
  const { isMounted } = useMounted();

  const fare = getTaxiFare(alarmRoute.departure, alarmRoute.arrival);

  const finish = () => {
    setAlarm(false);
    resetAlarmRoute();
    router.push('/');
  };

  return (
    <CompletedLayout
      backHref="/completed"
      message={
        <>
          {title}
          <Fare>
            <strong>{isMounted ? fare.toLocaleString() : '-'}원</strong>
            {suffix}
          </Fare>
        </>
      }
    >
      <button type="button" onClick={finish}>
        {buttonText}
      </button>
    </CompletedLayout>
  );
}

const Fare = styled.p`
  margin-top: 20px;
  font-size: 26px;
  line-height: 34px;
`;
