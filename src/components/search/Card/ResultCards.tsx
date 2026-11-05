import { getPathLists } from '@/utils/apis/path';
import { pathResultState } from '@/recoil/search';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { IQueryProps } from '@/type/search';
import ResultCard from './ResultCard';
import CloseError from '../CloseError';
import ResultCardSkeleton from './ResultCardSkeleton';

const ResultCards = () => {
  const pathResult = useRecoilValue(pathResultState);

  const queryKey = [
    'userRoute',
    pathResult.departure.x,
    pathResult.departure.y,
    pathResult.arrival.x,
    pathResult.arrival.y,
  ];

  const { data, isLoading } = useQuery<IQueryProps | string>({
    queryKey: queryKey,
    queryFn: () =>
      getPathLists({
        sx: pathResult.departure.x,
        sy: pathResult.departure.y,
        ex: pathResult.arrival.x,
        ey: pathResult.arrival.y,
      }),
  });

  if (isLoading) {
    return (
      <>
        {[0, 1, 2, 3].map((key) => (
          <ResultCardSkeleton key={key} />
        ))}
      </>
    );
  }

  return (
    <>
      {data &&
        (typeof data === 'string' ? (
          <CloseError />
        ) : (
          data?.route?.map(
            (
              { type, totalTime, totalDistance, subPath, lastBoardingTime },
              index
            ) => {
              return (
                <div key={index}>
                  {typeof data !== 'string' && (
                    <ResultCard
                      type={type}
                      totalTime={totalTime}
                      totalDistance={totalDistance}
                      subPath={subPath}
                      lastBoardingTime={lastBoardingTime}
                      index={index}
                    />
                  )}
                </div>
              );
            }
          )
        ))}
    </>
  );
};

export default ResultCards;
