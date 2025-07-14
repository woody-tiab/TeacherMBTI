# 교사 MBTI 수업 스타일 분석 웹앱 개발 규칙

## 프로젝트 개요

교사들의 수업 스타일을 16가지 MBTI 타입으로 분석하는 웹앱
- 기술 스택: React + TypeScript + TailwindCSS + Vite
- 핵심 기능: MBTI 테스트, 결과 분석, 소셜 공유
- 애니메이션과 트랜지션 효과 포함
- **GitHub Pages 자동 배포 지원**

## 프로젝트 구조

### 필수 디렉토리 구조
```
/
  /.github
    /workflows           # GitHub Actions 배포 워크플로우
  /public               # 정적 파일
  /src
    /components
      /common           # 공통 컴포넌트
      /question         # 질문 관련 컴포넌트
      /result           # 결과 관련 컴포넌트
    /pages              # 메인 페이지들
    /types              # TypeScript 타입 정의
    /data               # 정적 데이터 (질문, 결과)
    /utils              # 유틸리티 함수
    /hooks              # 커스텀 훅
    /assets             # 이미지, 아이콘
```

### 핵심 파일 구조
- `/package.json`: 의존성 관리 및 배포 스크립트
- `/vite.config.ts`: 빌드 설정 및 GitHub Pages base path 설정
- `/.github/workflows/deploy.yml`: GitHub Actions 자동 배포
- `/public/404.html`: SPA 라우팅 지원을 위한 폴백 페이지
- `/src/types/mbti.ts`: MBTI 관련 타입 정의
- `/src/data/questions.ts`: 질문 데이터
- `/src/data/results.ts`: 결과(MBTI 타입) 데이터
- `/src/utils/mbti.ts`: MBTI 계산 로직
- `/src/utils/share.ts`: 소셜 공유 로직

## GitHub Pages 배포 표준

### 빌드 도구 설정
- **Vite 사용 필수** (Create React App 금지)
- **vite.config.ts에서 base path 설정 필수**
  ```typescript
  export default defineConfig({
    base: '/repository-name/',  // GitHub repository 이름으로 설정
    // ... 기타 설정
  })
  ```

### 자동 배포 설정
- **GitHub Actions 워크플로우 필수 생성** (`.github/workflows/deploy.yml`)
- **main 브랜치 push 시 자동 배포**
- **빌드 결과물을 gh-pages 브랜치로 배포**
- **Node.js 18+ 사용**

### SPA 라우팅 처리
- **public/404.html 파일 필수 생성**
- **404.html은 index.html과 동일한 내용으로 작성**
- **React Router의 BrowserRouter 사용 시 필수**

### 배포 전 검증
- **빌드 오류 없음 확인**
- **타입 체크 통과 확인**
- **로컬에서 배포 버전 테스트 완료**

## 코드 표준

### TypeScript 규칙
- **모든 컴포넌트는 TypeScript로 작성**
- **엄격한 타입 체크 적용**
- **any 타입 사용 금지** (unknown 권장)
- **interface 우선 사용, type은 유니온 타입에만 사용**

### 스타일링 규칙
- **TailwindCSS만 사용**
- **인라인 스타일 완전 금지**
- **CSS 파일 생성 금지**
- **반응형 디자인 필수 적용**

### 컴포넌트 규칙
- **함수형 컴포넌트만 사용**
- **Props 타입 정의 필수**
- **default export 사용**
- **컴포넌트명은 PascalCase**

## 애니메이션 구현 표준

### 라이브러리 사용
- **Framer Motion 라이브러리 사용**
- **CSS 애니메이션 금지**

### 애니메이션 유형
- **페이지 전환**: AnimatePresence 사용
- **버튼 호버**: scale 및 색상 변화
- **진행률 표시**: 프로그레스 바 애니메이션
- **결과 표시**: 카드 등장 애니메이션

## 소셜 공유 기능 표준

### 우선순위
1. **Web Share API 우선 사용**
2. **지원하지 않는 브라우저**: URL 복사 또는 직접 SNS 링크
3. **react-share 라이브러리 사용 가능**

### 공유 데이터 포함 항목
- **결과 MBTI 타입**
- **결과 이미지**
- **설명 텍스트**
- **GitHub Pages 배포 URL 사용**

## 상태 관리 표준

### 상태 관리 라이브러리
- **React Context API 또는 Zustand 사용**
- **Redux 사용 금지**

### 상태 구조
- **현재 질문 인덱스**
- **사용자 답변 배열**
- **MBTI 결과**
- **진행률**

## 개발 워크플로우

### 개발 순서
1. **프로젝트 초기 설정** (Vite + TypeScript + TailwindCSS)
2. **GitHub Pages 배포 환경 구성** (워크플로우, 404.html)
3. **타입 정의 먼저 작성** (`types/mbti.ts`)
4. **데이터 구조 정의** (`data/questions.ts`, `data/results.ts`)
5. **공통 컴포넌트 개발** (`components/common`)
6. **페이지별 컴포넌트 개발** (`components/question`, `components/result`)
7. **유틸리티 함수 구현** (`utils/mbti.ts`, `utils/share.ts`)
8. **메인 페이지 통합**
9. **배포 전 테스트 및 검증**

### 파일 수정 시 주의사항
- **vite.config.ts 수정 시**: base path 설정 확인 필요
- **package.json 수정 시**: 배포 스크립트 확인 필요
- **타입 정의 수정 시**: 모든 관련 컴포넌트 검토 필요
- **데이터 구조 변경 시**: 유틸리티 함수와 컴포넌트 동시 수정
- **공통 컴포넌트 수정 시**: 모든 사용처 검토 필요

## 금지사항

### 코드 작성 금지사항
- **인라인 스타일 사용 금지**
- **console.log 프로덕션 코드에 남기기 금지**
- **any 타입 사용 금지**
- **하드코딩된 문자열 사용 금지** (상수화 필요)
- **CSS 파일 생성 금지**
- **클래스형 컴포넌트 사용 금지**

### 라이브러리 사용 금지사항
- **jQuery 사용 금지**
- **Bootstrap 사용 금지**
- **Styled-components 사용 금지**
- **Emotion 사용 금지**
- **Create React App 사용 금지** (Vite 사용)

### 배포 관련 금지사항
- **빌드 오류 상태로 배포 금지**
- **테스트되지 않은 코드 배포 금지**
- **base path 미설정 상태 배포 금지**
- **404.html 없이 SPA 배포 금지**

## AI 의사결정 가이드

### 새로운 컴포넌트 생성 시
1. **타입 정의부터 시작**
2. **재사용 가능성 검토**
3. **적절한 디렉토리 위치 결정**
4. **Props 인터페이스 정의**

### 기능 구현 시
1. **기존 유틸리티 함수 활용 우선**
2. **상태 관리 방식 일관성 유지**
3. **애니메이션 필요 여부 판단**
4. **반응형 디자인 고려**

### 버그 수정 시
1. **타입 에러 우선 해결**
2. **관련 컴포넌트 영향 검토**
3. **테스트 코드 작성 권장**
4. **성능 최적화 고려**

### 배포 관련 의사결정
1. **로컬 빌드 성공 확인 후 배포**
2. **GitHub repository 이름 확인 후 base path 설정**
3. **SPA 라우팅 사용 시 404.html 필수 생성**
4. **배포 후 GitHub Pages URL에서 동작 확인**

## 핵심 파일 상호작용 표준

### 동시 수정 필요 파일
- **`vite.config.ts` 수정 시**: `package.json`의 배포 스크립트 확인
- **`package.json` 수정 시**: GitHub Actions 워크플로우 확인
- **라우팅 변경 시**: `public/404.html` 업데이트 확인
- **`types/mbti.ts` 수정 시**: 모든 관련 컴포넌트와 유틸리티 파일 검토
- **`data/questions.ts` 수정 시**: `utils/mbti.ts`와 질문 컴포넌트 확인
- **`data/results.ts` 수정 시**: 결과 컴포넌트와 공유 기능 확인

### 배포 관련 의존성
- **GitHub Actions 워크플로우 수정 시**: Node.js 버전과 build 명령어 일치 확인
- **Vite 설정 변경 시**: GitHub Pages URL 구조 확인
- **public 폴더 파일 변경 시**: 빌드 결과물에 반영 확인

### 의존성 관리
- **공통 컴포넌트 우선 개발**
- **데이터 구조 안정화 후 UI 개발**
- **유틸리티 함수는 순수 함수로 작성**
- **배포 환경 설정 우선 완료** 