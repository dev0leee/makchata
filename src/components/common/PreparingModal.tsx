import styled from 'styled-components';
import PreparingNotice from '@/components/common/PreparingNotice';

export default function PreparingModal({ onClose }: { onClose: () => void }) {
  return (
    <Container>
      <div>
        <PreparingNotice />
        <button type="button" onClick={onClose}>
          알겠어요
        </button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  z-index: 30;
  position: fixed;
  top: 0;
  width: 390px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(36, 36, 36, 0.5);

  > div {
    width: 300px;
    padding: 32px 16px 20px;
    border-radius: 16px;
    background-color: #fff;
  }

  button {
    width: 100%;
    margin-top: 24px;
    padding: 13px 10px;
    border: none;
    border-radius: 14px;
    background-color: #ff8048;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }
`;
