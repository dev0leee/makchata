import styled from 'styled-components';
import Image from 'next/image';

interface IChipButton {
  text: string;
  icon: string;
  onClick: () => void;
  // outline: 흰 바탕에 테두리가 있는 칩 (장소 즐겨찾기)
  variant?: 'filled' | 'outline';
  selected?: boolean;
}

const ChipButton = ({
  text,
  icon,
  onClick,
  variant = 'filled',
  selected = false,
}: IChipButton) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      $variant={variant}
      $selected={selected}
    >
      <Image src={icon} alt="" width={14} height={14} />
      <p>{text}</p>
    </Button>
  );
};

const Button = styled.button<{
  $variant: 'filled' | 'outline';
  $selected: boolean;
}>`
  display: flex;
  gap: 4px;
  padding: 6px 10px;
  white-space: nowrap;
  align-items: center;
  border-radius: 30px;
  border: 1px solid
    ${({ $variant }) => ($variant === 'outline' ? '#ddd' : 'transparent')};
  background: ${({ $variant }) =>
    $variant === 'outline' ? '#fff' : '#e8ebed'};
  color: #242424;

  /* 선택된 칩은 주황 바탕에 흰 글자·아이콘 */
  ${({ $selected }) =>
    $selected &&
    `
    background: #ff8048;
    color: #fff;

    img {
      filter: brightness(0) invert(1);
    }
  `}
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
`;

export default ChipButton;
