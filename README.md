# mouse-ui

마우스로 UI를 만들면 HTML/CSS 코드가 자동으로 생성되는 비주얼 UI 빌더입니다.

## 현재 Savepoint

- 현재 단계: `v0.3.0` 속성 패널 구현 완료
- 현재 목표 버전: `v0.3.0`
- 다음 작업: `v0.3.0` PR 준비
- 다음 목표 버전: `v0.4.0` 컴포넌트 종류 확장
- MVP 방향: 버튼 추가, 선택, HTML 코드 실시간 생성부터 시작

## 버전 진행 방식

새 버전 구현은 이전 버전 PR이 `develop`에 반영된 뒤 새 브랜치에서 시작한다.

진행 순서:

1. 현재 버전 브랜치를 push한다.
2. `develop`을 base로 현재 버전 PR을 만든다.
3. PR 검토 후 merge한다.
4. 로컬 `develop`을 최신 상태로 pull 받는다.
5. 다음 버전 작업 브랜치를 새로 만든다.
6. 새 브랜치에서 다음 버전 체크리스트 구현을 시작한다.

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

## 프로젝트 방향성

이 프로젝트는 UI를 코드 문자열로 직접 관리하지 않고, `components` 데이터로 관리합니다.

```txt
UI 데이터
  -> 캔버스 미리보기
  -> HTML/CSS 코드 생성
```

처음에는 HTML + inline CSS 코드 생성을 우선하고, 이후 React JSX, 템플릿, AI 기반 UI 생성 기능을 단계적으로 확장합니다.

## 문서

- [제품 기획서](docs/product_plan.md)
- [개발 방향 및 규칙](docs/development_rules.md)
- [파일 구조 및 분리 규칙](docs/file_structure_rules.md)
- [버전 관리 및 체크리스트](docs/version_checklist.md)
- [변경 기록](docs/change_log.md)
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
