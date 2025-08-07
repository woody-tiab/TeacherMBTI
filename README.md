# 🏫 교사 MBTI 수업 스타일 분석

> 교사들의 수업 스타일을 16가지 MBTI 타입으로 분석하여 더 효과적인 교육 방법을 제시하는 React 웹앱

[![Deploy to GitHub Pages](https://github.com/woody-tiab/TeacherMBTI/actions/workflows/deploy.yml/badge.svg)](https://github.com/woody-tiab/TeacherMBTI/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

---

## 🆕 최근 업데이트 내역

- **상단 네비게이션 브랜딩 개선**
  - 메뉴바 텍스트를 'TeacherMBTI'로 변경하여 브랜드 인식 강화
- **PC 화면에서 차트(ScoreChart) 100% 정렬 문제 완벽 해결**
  - 퍼센트 텍스트 가운데 정렬 일관성 개선 (67%와 100% 정렬 통일)
- **결과 페이지 UI/UX 대폭 개선**  
  - 중복 제목 영역 제거로 깔끔한 레이아웃 구현
  - "다시 테스트하기" 단독, "결과 공유/저장" 나란히 2줄 배치
  - 탭 네비게이션 줄바뀜 문제 해결
- **"다시 테스트하기" 버튼 클릭 시 테스트 완전 초기화**
- **404/흰 화면 등 오류 발생 시 사용자 경험 개선**
  - og-image.png 참조 오류 제거로 안정성 향상
- **PC 레이아웃 완벽 최적화**  
  - 모든 화면에서 일관된 중앙 정렬, 반응형 레이아웃 강화
  - 버튼 레이아웃 flex-wrap 적용으로 다양한 화면 크기 대응
- **코드 리팩토링 및 성능 최적화**

---

## 🎯 프로젝트 개요

교사 MBTI 분석 웹앱은 교육자들이 자신의 수업 스타일을 이해하고 개선할 수 있도록 도와주는 도구입니다. 24개의 실제 교육 상황 기반 질문을 통해 16가지 MBTI 타입 중 하나로 분류하고, 각 타입별 맞춤형 교육 방법론을 제시합니다.

**🌐 Live Demo**: [https://woody-tiab.github.io/TeacherMBTI/](https://woody-tiab.github.io/TeacherMBTI/)

## ✨ 주요 기능

### 📋 **MBTI 기반 수업 스타일 분석**
- 24개의 실제 교육 상황별 질문
- 정확한 MBTI 분석 알고리즘
- 즉시 결과 확인

### 🎨 **16가지 MBTI 타입별 상세 분석**
- 각 타입별 수업 스타일 특성
- 강점과 개선점 제시
- 맞춤형 교육 방법론 안내
- 학생과의 소통 방식 가이드

### 🎭 **뛰어난 사용자 경험**
- Framer Motion 기반 부드러운 애니메이션
- 진행률 표시 및 실시간 피드백
- 직관적인 UI/UX 디자인
- 접근성 완벽 지원 (WCAG 2.1 AA 준수)

### 📱 **완벽한 반응형 디자인**
- 모바일, 태블릿, 데스크톱 최적화
- 다양한 화면 크기 지원
- Touch-friendly 인터페이스

### 🔗 **소셜 공유 기능**
- 결과 URL 복사 및 공유
- 소셜미디어 직접 공유 (Facebook, Twitter, KakaoTalk, LINE)
- 결과 이미지 생성 및 다운로드
- Web Share API 지원

### ⚡ **성능 최적화**
- 코드 스플리팅으로 빠른 로딩
- 번들 크기 최적화
- 이미지 최적화
- PWA 지원 준비

## 🚀 기술 스택

### **Frontend**
- **React 18** - 최신 React 기능 활용
- **TypeScript** - 타입 안정성 보장
- **Vite** - 초고속 빌드 도구
- **TailwindCSS** - 유틸리티 우선 CSS 프레임워크
- **Framer Motion** - 고품질 애니메이션

### **State Management & Routing**
- **React Router Dom** - SPA 라우팅
- **Custom Hooks** - 상태 관리 최적화

### **Development & Build Tools**
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **TypeScript Strict Mode** - 엄격한 타입 체크

### **Deployment & CI/CD**
- **GitHub Pages** - 정적 사이트 호스팅
- **GitHub Actions** - 자동 빌드 및 배포
- **Cache Optimization** - 빌드 성능 최적화

## 🛠 개발 환경 설정

### **필수 요구사항**
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### **설치 및 실행**

```bash
# 프로젝트 클론
git clone https://github.com/woody-tiab/TeacherMBTI.git
cd TeacherMBTI

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 배포 (GitHub Pages)
npm run deploy
```

## 📦 프로젝트 구조

```
TeacherMBTI/
├── public/                  # 정적 파일
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   │   ├── Button.tsx   # 버튼 컴포넌트
│   │   │   ├── Card.tsx     # 카드 컴포넌트
│   │   │   ├── Loading.tsx  # 로딩 컴포넌트
│   │   │   ├── Navigation.tsx # 네비게이션
│   │   │   ├── ProgressBar.tsx # 진행률 바
│   │   │   └── ShareButton.tsx # 공유 버튼
│   │   ├── question/        # 질문 관련 컴포넌트
│   │   │   ├── AnswerButton.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── QuestionNavigation.tsx
│   │   └── result/          # 결과 관련 컴포넌트
│   │       ├── ResultCard.tsx
│   │       ├── ScoreChart.tsx
│   │       ├── TeachingStyleInfo.tsx
│   │       └── TypeDescription.tsx
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── HomePage.tsx     # 메인 페이지
│   │   ├── TestPage.tsx     # 테스트 페이지
│   │   ├── ResultPage.tsx   # 결과 페이지
│   │   └── NotFoundPage.tsx # 404 페이지
│   ├── types/               # TypeScript 타입 정의
│   │   └── mbti.ts
│   ├── data/                # 정적 데이터
│   │   ├── questions.ts     # MBTI 질문 데이터
│   │   └── results.ts       # MBTI 결과 데이터
│   ├── utils/               # 유틸리티 함수
│   │   ├── mbti.ts          # MBTI 계산 로직
│   │   └── share.ts         # 공유 기능
│   ├── hooks/               # 커스텀 훅
│   │   ├── useMBTITest.ts   # MBTI 테스트 훅
│   │   └── index.ts
│   ├── constants/           # 상수 정의
│   │   ├── shareText.ts     # 공유 텍스트
│   │   └── socialPlatforms.tsx # 소셜 플랫폼
│   ├── assets/              # 정적 자원
│   ├── main.tsx            # 엔트리 포인트
│   └── index.css           # 글로벌 스타일
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 워크플로우
├── vite.config.ts          # Vite 설정
├── tailwind.config.js      # TailwindCSS 설정
├── tsconfig.json           # TypeScript 설정
└── package.json            # 프로젝트 메타데이터
```

## 🌐 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

### **자동 배포 과정**
1. `main` 브랜치에 코드 push
2. GitHub Actions가 자동으로 트리거됨
3. 타입 체크 및 린트 검사 수행
4. 프로덕션 빌드 생성
5. GitHub Pages에 자동 배포
6. 배포 완료 알림

### **수동 배포**
```bash
npm run deploy
```

## 📊 성능 최적화

### **번들 크기 최적화**
- 코드 스플리팅으로 vendor와 app 코드 분리
- Tree shaking으로 미사용 코드 제거
- 동적 import로 필요시에만 로딩

### **빌드 최적화**
- Terser를 사용한 JavaScript 압축
- CSS 최적화 및 압축
- 이미지 최적화

### **성능 목표 지표**
> 다음은 프로덕션 환경에서 달성하고자 하는 목표 성능 지표입니다.
> 실제 측정을 위해서는 Chrome DevTools Lighthouse 또는 [PageSpeed Insights](https://pagespeed.web.dev/)를 사용하세요.

- **Lighthouse Score 목표**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **번들 크기 목표**: < 500KB (gzipped)
- **First Contentful Paint 목표**: < 1.5s
- **Largest Contentful Paint 목표**: < 2.5s

## 🔧 개발 가이드

### **코딩 규칙**
- TypeScript Strict Mode 사용
- ESLint 규칙 준수
- 함수형 컴포넌트 및 Hook 패턴 사용
- CSS-in-JS 대신 TailwindCSS 활용

### **커밋 메시지 규칙**
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 설정 변경
```

### **브랜치 전략**
- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

## 🧪 테스트

### **수동 테스트 체크리스트**
- [ ] 24개 질문 모두 정상 표시
- [ ] 답변 선택 및 네비게이션 정상 동작
- [ ] 결과 페이지 정확한 타입 표시
- [ ] 소셜 공유 기능 정상 동작
- [ ] 반응형 디자인 확인 (모바일, 태블릿, 데스크톱)
- [ ] 접근성 확인 (키보드 네비게이션, 스크린 리더)
- [ ] 브라우저 호환성 (Chrome, Firefox, Safari, Edge)

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📋 개발 규칙

자세한 개발 규칙은 [shrimp-rules.md](./shrimp-rules.md)를 참조하세요.

## 📈 로드맵

### **v1.1.0 (예정)**
- [ ] PWA 지원 완료
- [ ] 오프라인 모드 지원
- [ ] 결과 저장 기능
- [ ] 통계 대시보드

### **v1.2.0 (예정)**
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 테마 변경 기능 (다크 모드)
- [ ] 상세 분석 리포트

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)로 배포됩니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 [Issues](https://github.com/woody-tiab/TeacherMBTI/issues)를 통해 연락해 주세요.

---

**Made with ❤️ by Kimwoody** 