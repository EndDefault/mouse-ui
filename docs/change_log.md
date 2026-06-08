# 변경 기록

이 문서는 작업 진행 체크리스트가 아니라, 프로젝트 방향이나 기준이 바뀐 큰 결정을 기록한다.

진행 여부는 `docs/version_checklist.md`에서 관리하고, 이 문서에는 기존 방향을 바꾸거나 덮어쓰는 결정만 남긴다.

## 기록 기준

다음 경우에만 기록한다.

- 프로젝트 방향이 바뀐 경우
- MVP 범위가 바뀐 경우
- 폴더 구조나 파일 분리 규칙이 바뀐 경우
- 기술 스택이 바뀐 경우
- 버전 계획이 바뀐 경우
- 기존 문서의 기준을 덮어쓰는 결정이 생긴 경우

## 2026-06-09

### 파일 구조 기준 변경

이전 기준:

- `components/`, `utils/`, `constants/` 중심의 단순 구조
- `App.jsx`가 전체 상태 관리와 화면 조립을 많이 담당하는 구조

변경 기준:

- `features/builder/` 중심의 기능별 구조로 변경
- `toolbar/`, `canvas/`, `inspector/`, `code/`, `model/`, `codegen`, `storage/`로 역할 세분화
- `ButtonTool.jsx`, `ButtonCanvasItem.jsx`, `CopyCodeButton.jsx`처럼 기능별 파일 생성을 기본 규칙으로 설정
- 반복된 UI와 로직은 충분히 반복된 뒤 `shared/` 또는 `global/`로 정규화

변경 이유:

- `App.jsx`나 단일 컴포넌트 파일에 코드가 몰리는 것을 방지하기 위해
- 새 기능을 추가할 때 파일 위치와 책임을 명확하게 하기 위해
- 초보자도 파일 이름만 보고 수정 위치를 찾기 쉽게 하기 위해

영향받는 문서:

- `docs/file_structure_rules.md`
- `docs/development_rules.md`
- `docs/product_plan.md`
- `docs/version_checklist.md`
