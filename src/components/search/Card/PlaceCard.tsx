'use client';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { addressesState, pathResultState, searchState } from '@/recoil/search';
import { IPlaceCard } from '@/type/search';
import PlaceItem from '@/components/common/PlaceItem';

const PlaceCard = ({ location, address, x, y, type }: IPlaceCard) => {
  const [path, setPath] = useRecoilState(pathResultState);
  const resetAddress = useResetRecoilState(addressesState);
  const [search, setSearch] = useRecoilState(searchState);
  const saveAddress = () => {
    if (type === 'departure') {
      setPath({ ...path, departure: { address, location, x, y } });
      setSearch({ ...search, departure: location });
      resetAddress();
      return;
    } else if (type === 'arrival') {
      setPath({ ...path, arrival: { address, location, x, y } });
      setSearch({ ...search, arrival: location });
      resetAddress();
      return;
    }
  };

  return (
    <PlaceItem location={location} address={address} onSelect={saveAddress} />
  );
};

export default PlaceCard;
