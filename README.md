# mouse-ui

마우스로 UI를 만들면 HTML/CSS 코드가 자동으로 생성되는 비주얼 UI 빌더입니다.

## 현재 Savepoint

- 현재 단계: `v0.5.0` 저장, 불러오기, 코드 복사 구현 완료
- 현재 목표 버전: `v0.5.0`
- 다음 작업: `v0.5.0`을 `develop`에 반영한 뒤 `main` 저장 준비
- 다음 목표 버전: `v1.0.0` 새 기준 재정의와 1차 MVP 안정화
- MVP 방향: 버튼 추가, 선택, HTML 코드 실시간 생성부터 시작

## 작업 흐름

초기 버전에서는 작은 버전마다 PR과 문서 갱신을 촘촘히 관리했다. 이제부터는 기능 구현 속도를 우선한다.

진행 방식:

1. 사용자는 큰 방향과 우선순위를 정한다.
2. Codex가 기능 단위로 구현하고 검증한다.
3. 커밋은 기능 단위로 나눈다.
4. README와 docs는 버전이나 큰 작업 묶음이 끝날 때 확인하고 정리한다.
5. PR은 사용자가 확인해야 하는 큰 묶음이 됐을 때 만든다.

## 현재 진행도

- [x] 프로젝트 기획 정리
- [x] 개발 방향 및 규칙 정리
- [x] 파일 구조 및 분리 규칙 정리
- [x] 버전 관리 및 체크리스트 작성
- [x] 큰 방향 변경 기록 문서 작성
- [x] Gitmoji 커밋 규칙 정리
- [x] PR 작성 규칙 정리
- [x] React 프로젝트 초기 설정
- [x] `v0.1.0` 구현 완료
- [x] `v0.2.0` 진입 전 절차 정리
- [x] `v0.2.0` 드래그 이동과 크기 조절 구현 완료
- [x] `v0.3.0` 속성 패널 구현 완료
- [x] `v0.4.0` 진입 전 준비 문서 정리
- [x] `v0.4.0` 컴포넌트 종류 확장 구현 완료
- [x] `v0.5.0` 저장, 불러오기, 코드 복사 구현 완료

## 프로젝트 방향성

이 프로젝트는 UI를 코드 문자열로 직접 관리하지 않고, `components` 데이터로 관리합니다.

```txt
UI 데이터
  -> 캔버스 미리보기
  -> HTML/CSS 코드 생성
```

처음에는 HTML + inline CSS 코드 생성을 우선하고, 이후 React JSX, 템플릿, AI 기반 UI 생성 기능을 단계적으로 확장합니다.

## 문서

- [docs 구조 안내](docs/README.md)
- [v1 기획 문서](docs/v1/README.md)
- [작업 흐름 설명서](docs/workflow.md)
- [제품 기획서](docs/product_plan.md)
- [개발 방향 및 규칙](docs/development_rules.md)
- [파일 구조 및 분리 규칙](docs/file_structure_rules.md)
- [버전 관리 및 체크리스트](docs/version_checklist.md)
- [변경 기록](docs/change_log.md)
- [v0 작업 기록](docs/history/v0.md)
- [커밋 규칙](docs/commit_convention.md)
- [PR 작성 규칙](docs/pr_convention.md)

## 실행 방법

의존성을 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

프로덕션 빌드를 확인합니다.

```bash
npm run build
```
