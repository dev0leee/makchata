import styled, { keyframes } from 'styled-components';

// ResultCard 와 같은 배치(교통수단·막차/소요시간, 경로 바, 출발까지 남은 시간)로 자리만 보여준다
const ResultCardSkeleton = () => {
  return (
    <Wrap aria-hidden>
      <Header>
        <Block $width="64px" $height="24px" />
        <Block $width="180px" $height="16px" />
      </Header>
      <Block
        $width="100%"
        $height="16px"
        $radius="100px"
        $margin="20px 0 16px"
      />
      <Block $width="200px" $height="34px" $margin="0 auto" />
    </Wrap>
  );
};

export default ResultCardSkeleton;

const shimmer = keyframes`
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
`;

const Wrap = styled.article`
  padding: 20px 16px 24px;
  border-bottom: 8px solid #f3f3f3;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Block = styled.div<{
  $width: string;
  $height: string;
  $radius?: string;
  $margin?: string;
}>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  margin: ${({ $margin }) => $margin ?? '0'};
  border-radius: ${({ $radius }) => $radius ?? '8px'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
