import icHome from 'public/assets/icons/ic_home.svg';
import icWork from 'public/assets/icons/ic_work.svg';
import icSchool from 'public/assets/icons/ic_school.svg';
import icFlag from 'public/assets/icons/ic_flag.svg';

// 즐겨찾기 명칭에 맞는 칩 아이콘 (해당하지 않으면 깃발)
export const getFavoriteIcon = (name: string) => {
  if (name.includes('집')) return icHome;
  if (name.includes('회사')) return icWork;
  if (name.includes('학교')) return icSchool;
  return icFlag;
};
