import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import icFlagOrange from 'public/assets/icons/ic_flag_orange.svg';
import icEditGray from 'public/assets/icons/ic_edit_gray.svg';
import icDeleteGray from 'public/assets/icons/ic_delete_gray.svg';
import { IFavorite } from '@/type/favorite';
import { favoritesState } from '@/recoil/favorite';
import { useMounted } from '@/hooks/useMounted';

interface IFavoriteList {
  onAdd: () => void;
  onEdit: (favorite: IFavorite) => void;
  onDelete: (favorite: IFavorite) => void;
}

export default function FavoriteList({
  onAdd,
  onEdit,
  onDelete,
}: IFavoriteList) {
  const favorites = useRecoilValue(favoritesState);
  // 즐겨찾기는 브라우저 저장값이라 서버 렌더 결과와 어긋나지 않도록 마운트 후에 그린다
  const { isMounted } = useMounted();

  return (
    <Container>
      {isMounted &&
        favorites.map((favorite) => (
          <Item key={favorite.id}>
            <Image src={icFlagOrange} alt="" />
            <Info>
              <Name>{favorite.name}</Name>
              <Location>{favorite.place.location}</Location>
              <Address>{favorite.place.address}</Address>
            </Info>
            <Actions>
              <button
                type="button"
                aria-label={`${favorite.name} 수정`}
                onClick={() => onEdit(favorite)}
              >
                <Image src={icEditGray} alt="" />
              </button>
              <button
                type="button"
                aria-label={`${favorite.name} 삭제`}
                onClick={() => onDelete(favorite)}
              >
                <Image src={icDeleteGray} alt="" />
              </button>
            </Actions>
          </Item>
        ))}
      <AddButton type="button" onClick={onAdd}>
        <span aria-hidden>+</span> 장소 추가하기
      </AddButton>
    </Container>
  );
}

const Container = styled.main`
  padding: 0 16px;
`;

const Item = styled.article`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 12px;
  border-bottom: 1px solid #eee;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;

  > button {
    display: flex;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
`;

const Name = styled.p`
  margin-bottom: 6px;
  color: #242424;
  font-size: 14px;
  line-height: 20px;
`;

const Location = styled.p`
  color: #242424;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`;

const Address = styled.p`
  margin-top: 4px;
  color: #888;
  font-size: 12px;
  line-height: 18px;
`;

const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 24px 0;
  border: none;
  background: none;
  color: #888;
  font-size: 15px;
  cursor: pointer;

  > span {
    color: #666;
    font-size: 26px;
    font-weight: 300;
    line-height: 1;
  }
`;
