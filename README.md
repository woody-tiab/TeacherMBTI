# 교사 MBTI 수업 스타일 분석

교사들의 수업 스타일을 16가지 MBTI 타입으로 분석하는 React 웹앱입니다.

## 🎯 프로젝트 개요

- **목적**: 교사들이 자신의 수업 스타일을 MBTI 타입으로 분석하고 이해할 수 있도록 도움
- **기술 스택**: React + TypeScript + Vite + TailwindCSS + Framer Motion
- **배포**: GitHub Pages 자동 배포

## ✨ 주요 기능

- 📝 MBTI 기반 수업 스타일 테스트
- 🎨 16가지 MBTI 타입별 상세 분석
- 🎭 애니메이션과 트랜지션 효과
- 📱 반응형 디자인
- 🔗 소셜 공유 기능

## 🚀 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 배포 (GitHub Pages)
npm run deploy
```

## 📦 프로젝트 구조

```
src/
├── components/
│   ├── common/          # 공통 컴포넌트
│   ├── question/        # 질문 관련 컴포넌트
│   └── result/          # 결과 관련 컴포넌트
├── pages/               # 메인 페이지들
├── types/               # TypeScript 타입 정의
├── data/                # 정적 데이터 (질문, 결과)
├── utils/               # 유틸리티 함수
├── hooks/               # 커스텀 훅
└── assets/              # 이미지, 아이콘
```

## 🌐 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

1. `main` 브랜치에 코드를 push
2. GitHub Actions가 자동으로 빌드 및 배포 실행
3. GitHub Pages에서 확인 가능

**배포 URL**: `https://[username].github.io/TeacherMBTI/`

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Routing**: React Router Dom
- **Deployment**: GitHub Pages + GitHub Actions

## 📋 개발 규칙

자세한 개발 규칙은 [shrimp-rules.md](./shrimp-rules.md)를 참조하세요.

## 📄 라이선스

MIT License 