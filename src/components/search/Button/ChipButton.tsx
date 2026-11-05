import styled from 'styled-components';
import IcHome from 'public/assets/icons/ic_home.svg';
import Image from 'next/image';

interface IChipButton {
  text: string;
  onClick: () => void;
}

const ChipButton = ({ text, onClick }: IChipButton) => {
  return (
    <Button onClick={onClick}>
      <Image src={IcHome} alt="집" />
      <p>{text}</p>
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  gap: 4px;
  padding: 4px 8px;
  white-space: nowrap;
  align-items: center;
  border-radius: 30px;
  background: #e8ebed;
  border: none;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
`;

export default ChipButton;
