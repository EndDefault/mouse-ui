# 변경 기록

이 문서는 프로젝트 방향, 버전 계획, 문서 구조, 구현 기준이 바뀐 내용을 기록한다.

## 2026-06-10

### v1.3 구현 완료

이전 기준:

- v1.3 기획안은 컨테이너 중심 구조, 애니메이션 미리보기, 도킹 작업 패널, 꾸미기 확장을 목표로 했다.
- 오른쪽 패널은 고정 사이드바였고, 스타일 편집은 배경색/글자색/기본 그라데이션/모서리 중심이었다.

변경 기준:

- 박스 추가 기능을 제거하고, 기존 `box` 저장 데이터는 불러오기 시 `container`로 변환한다.
- 컨테이너 안에 컨테이너를 추가할 수 있고, 중첩 구조는 캔버스와 HTML 생성에서 같은 `parentId` 기준으로 처리한다.
- 캔버스에서 애니메이션을 직접 미리볼 수 있게 하고, 진입 재생과 상태 토글을 제공한다.
- 오른쪽 고정 사이드바를 도킹 작업 패널로 전환하고, 조정/꾸미기/애니메이션/HTML 탭으로 분리했다.
- 작업 패널의 위치, 크기, 열린 탭, 도킹 여부는 project JSON이 아닌 workspace settings에 저장한다.
- 꾸미기 탭에서 그라데이션 기준점, 그림자, border, 모서리, 투명도를 조정할 수 있게 했다.
- 생성 HTML에 그라데이션 기준점, 그림자, border, 투명도, 중첩 컨테이너, 애니메이션 클래스가 반영된다.

변경 이유:

- UI 빌더를 단순 배치 도구에서 실제 화면 설계 도구에 가까운 작업 흐름으로 확장하기 위해
- project 데이터와 작업 환경 데이터를 분리해 내보내기/불러오기 결과를 예측 가능하게 유지하기 위해
- 캔버스에서 보이는 결과와 생성 HTML 결과의 차이를 줄이기 위해

영향받는 문서:

- `docs/v1/checklist.md`
- `docs/v1/data_rules.md`
- `docs/v1/file_structure.md`
- `docs/v1/v1_3_plan.md`

### v1.3 기획안 추가

변경 기준:

- v1.3은 컨테이너 중심 구조, 애니메이션 미리보기, 도킹 작업 패널, 꾸미기 기능 확장을 다음 목표로 둔다.
- 기존 `box`는 컨테이너와 역할이 겹치므로 새 UI에서는 제거하고, 저장 데이터에서는 `container`로 변환한다.
- project JSON과 workspace settings를 분리한다.

영향받는 문서:

- `docs/v1/v1_3_plan.md`
- `docs/v1/README.md`
- `docs/v1/checklist.md`

### v0 문서 폴더 정리

변경 기준:

- v0 전용 문서는 `docs/v0/` 아래로 모았다.
- 여러 버전에서 함께 쓰는 `workflow`, `change_log`, `commit_convention`, `pr_convention`은 `docs/` 최상위에 둔다.
- v1 문서는 `docs/v1/`에서 관리한다.

영향받는 문서:

- `docs/README.md`
- `docs/v0/README.md`
- `docs/v0/product_plan.md`
- `docs/v0/development_rules.md`
- `docs/v0/file_structure_rules.md`
- `docs/v0/version_checklist.md`
- `docs/v0/history.md`

### v1 기획 문서 분리

변경 기준:

- v0 문서는 참조 가능한 기준으로 보관하고, 다음 작업은 `docs/v1/`에서 v1 목표와 구조를 다시 기획한다.
- v1 방향은 영역 구성, 반응형 작업 환경, 스타일 확장, 애니메이션, 캔버스 조작 중심으로 둔다.

영향받는 문서:

- `docs/v1/README.md`
- `docs/v1/product_plan.md`
- `docs/v1/workflow.md`
- `docs/v1/checklist.md`
- `docs/v1/file_structure.md`
- `docs/v1/data_rules.md`

## 2026-06-09

### 파일 구조 기준 변경

변경 기준:

- `App.jsx`에 몰려 있던 상태 관리와 화면 조립을 기능별 파일로 분리한다.
- `features/builder/` 중심의 구조를 사용한다.
- `toolbar/`, `canvas/`, `inspector/`, `code/`, `model/`, `codegen/`, `storage/`로 역할을 나눈다.

변경 이유:

- 새 기능을 추가할 때 수정 위치와 책임을 명확하게 유지하기 위해
- 초보자도 파일 이름만 보고 수정 위치를 찾기 쉽게 하기 위해

영향받는 문서:

- `docs/v0/file_structure_rules.md`
- `docs/v0/development_rules.md`
- `docs/v0/product_plan.md`
- `docs/v0/version_checklist.md`
