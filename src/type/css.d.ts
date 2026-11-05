// Next.js 13 은 *.module.css 만 타입을 선언해, TypeScript 6 의 side-effect import 검사에서
// import './globals.css' 가 오류로 잡히지 않도록 일반 CSS 파일 모듈을 선언한다
declare module '*.css';
