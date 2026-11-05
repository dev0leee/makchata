'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import ArrowIcon from '../ArrowIcon';
import FavoriteList from '@/components/setting/FavoriteList';
import FavoriteForm from '@/components/setting/FavoriteForm';
import Toast from '@/components/common/Toast';
import { favoritesState } from '@/recoil/favorite';
import { IFavorite } from '@/type/favorite';

// 목록 / 새로 추가 / 수정 중 하나를 보여준다
type TMode =
  | { type: 'list' }
  | { type: 'add' }
  | { type: 'edit'; favorite: IFavorite };

export default function FavoritesSetting() {
  const setFavorites = useSetRecoilState(favoritesState);
  const [mode, setMode] = useState<TMode>({ type: 'list' });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = setTimeout(() => setToastMessage(''), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const deleteFavorite = ({ id }: IFavorite) => {
    setFavorites((prev) => prev.filter((favorite) => favorite.id !== id));
    setToastMessage('즐겨찾기를 삭제했어요');
  };

  const onSaved = () => {
    if (mode.type === 'edit') setToastMessage('즐겨찾기를 수정했어요');
    setMode({ type: 'list' });
  };

  return (
    <>
      <Header>
        <Link href="/setting">
          <ArrowIcon color="#242424" />
        </Link>
        <Title>즐겨찾기 관리</Title>
      </Header>
      {mode.type === 'list' ? (
        <FavoriteList
          onAdd={() => setMode({ type: 'add' })}
          onEdit={(favorite) => setMode({ type: 'edit', favorite })}
          onDelete={deleteFavorite}
        />
      ) : (
        <FavoriteForm
          key={mode.type === 'edit' ? mode.favorite.id : 'add'}
          favorite={mode.type === 'edit' ? mode.favorite : undefined}
          onSaved={onSaved}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
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

const Title = styled.h1`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
`;
