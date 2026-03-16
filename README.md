# FE Trading System (Toy Project)

실시간 호가 UI와 기본 주문 플로우를 연습하기 위해 만든 프론트엔드 토이 프로젝트입니다.  
`mock` 데이터로 빠르게 개발할 수 있고, 옵션으로 Binance 공개 API를 연결해 실제 시장 변동을 확인할 수 있습니다.

## 주제

- AG Grid 기반 실시간 호가 테이블 구현
- 주문 모달 및 주문 완료 흐름 구현
- Mock에서 공개 API로 확장 가능한 구조 설계

## 주요 기능

- TanStack Query 기반 실시간 호가 스트림 처리
- row별 변화량 히스토리를 보여주는 `Timeline` 컬럼
- 네이티브 `<dialog>` 기반 주문 모달 및 수량 검증
- `Zustand` 기반 상태 관리 (`selectedQuote`, `orderResult`, `theme`)
- `react-i18next` 기반 다국어 지원 (`en`, `kr`)
- `openapi-fetch` + `openapi-typescript` 기반 API 타입 안정성
- `Vitest`(unit), `Playwright`(e2e) 테스트 구성

## 기술 스택

- React 19 + TypeScript + Vite
- TanStack Query
- AG Grid
- Zustand
- MSW
- Vitest / Playwright

## 아키텍처

Feature-Sliced Design(FSD) 구조를 따릅니다.

- `pages`: 라우트 단위 페이지
- `widgets`: 복합 UI 블록 (`order-book`, `trade-panel`)
- `features`: 사용자 액션 (`place-order`)
- `entities`: 도메인 모델 (`orderbook`)
- `shared`: 공용 API/설정/UI/유틸

## 빠른 시작

### 1) Node 버전 맞추기

`.nvmrc` 기준 버전을 사용합니다.

```bash
nvm use
```

### 2) 의존성 설치

```bash
pnpm install
```

### 3) 개발 서버 실행

```bash
pnpm dev
```

기본 주소: `http://localhost:5173`

## 데이터 소스 설정

기본값은 `mock`입니다.  
`.env` 설정으로 Binance 실데이터로 전환할 수 있습니다.

```bash
# mock | binance
VITE_ORDERBOOK_SOURCE=binance

# optional
VITE_BINANCE_SYMBOL=BTCUSDT
VITE_BINANCE_DEPTH_LIMIT=8
VITE_BINANCE_REST_BASE_URL=https://api.binance.com
VITE_BINANCE_WS_BASE_URL=wss://stream.binance.com:9443/ws
```

- `mock`: MSW 기반 더미 데이터
- `binance`: REST 스냅샷 + WebSocket depth patch

## 테스트 / 품질 점검

```bash
pnpm lint
pnpm run typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## 주요 스크립트

```bash
pnpm dev
pnpm build
pnpm preview
pnpm knip
pnpm generate:api-types
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:e2e
```

## 라우트

- 거래 페이지: `/trade`
- 주문 완료 페이지: `/complete`
