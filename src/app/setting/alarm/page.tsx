'use client';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { alarmCheckedState, vibrationPatternState } from '@/recoil/alarm';
import styled from 'styled-components';
import { ALARM_TIME } from '@/constants/route';
import type { IAlarm } from '@/type/alarm';
import ArrowIcon from '../ArrowIcon';
import InputCheckbox from '@/components/common/InputCheckbox';

export default function AlarmSetting() {
  const [alarmTime, setAlarmTime] = useRecoilState(alarmCheckedState);
  const [vibrationPattern, setVibrationPattern] = useRecoilState(
    vibrationPatternState
  );

  // 알림 모달(AlarmModal)과 같은 { text, checked } 형태를 유지해야 두 화면의 선택값이 공유된다
  const handleAlarmCheckChange = (index: number) => {
    setAlarmTime((prev: IAlarm[]) => {
      const newAlarmTime = [...prev];
      newAlarmTime[index] = {
        ...newAlarmTime[index],
        checked: !newAlarmTime[index].checked,
      };
      return newAlarmTime;
    });
  };

  return (
    <>
      <Header>
        <Link href="/setting">
          <ArrowIcon color="#242424" />
        </Link>
        <Title>알람 주기 관리</Title>
      </Header>
      <Container>
        <section>
          <SubTitle>원하는 알람시간을 선택해주세요</SubTitle>
          <CheckboxList>
            {ALARM_TIME.map((list, index) => (
              <li key={list}>
                {/* 알림 모달과 같은 주황 체크박스 */}
                <InputCheckbox>
                  <input
                    type="checkbox"
                    id={`frequency-${index}`}
                    checked={alarmTime[index].checked}
                    onChange={() => handleAlarmCheckChange(index)}
                  />
                  <label htmlFor={`frequency-${index}`}>{list}</label>
                </InputCheckbox>
              </li>
            ))}
          </CheckboxList>
        </section>
        <section>
          <SubTitle>진동 주기를 선택해주세요</SubTitle>
          <RadioButtonList>
            {['드득', '드득드득', '드드드드득'].map((pattern, index) => (
              <li key={pattern}>
                <label>
                  <input
                    type="radio"
                    id={`pattern-${index}`}
                    name="pattern"
                    checked={vibrationPattern === index}
                    onChange={() => setVibrationPattern(index)}
                  />
                  {pattern}
                </label>
              </li>
            ))}
          </RadioButtonList>
        </section>
      </Container>
    </>
  );
}

const Header = styled.header`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  > :first-child {
    position: absolute;
    left: 16px;
    rotate: 180deg;
  }
`;

const Container = styled.main`
  padding: 28px 16px 0;
  section + section {
    margin-top: 42px;
  }
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;

const CheckboxList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 32px;
  color: #666;
  font-size: 16px;
  line-height: 22px;
  list-style: none;
`;

// 기본 라디오 대신 회색 원, 선택하면 주황 테두리 원으로 보여준다
const RadioButtonList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 32px;
  color: #666;
  font-size: 16px;
  line-height: 22px;
  list-style: none;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  input[type='radio'] {
    appearance: none;
    width: 20px;
    height: 20px;
    margin: 0;
    border: 1px solid #ddd;
    border-radius: 50%;
    background-color: #eee;
    cursor: pointer;

    &:checked {
      border: 5px solid #ff8048;
      background-color: #fff;
    }
  }
`;
