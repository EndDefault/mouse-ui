# v1 문서 안내

이 폴더는 `mouse-ui`를 단순 배치 도구에서 실제 화면 설계 도구로 확장하기 위한 v1 기준 문서를 모은다.

## 문서 목록

- [v1 전체 기획안](product_plan.md): 목표, 핵심 방향, 기능 목록, 우선순위
- [v1 작업 흐름](workflow.md): 기획부터 구현, 점검, PR 전까지의 진행 방식
- [v1 체크리스트](checklist.md): 구현 완료 기준과 기능별 점검 항목
- [v1 파일 구조 기준](file_structure.md): 기능별 파일 위치와 책임 기준
- [v1 데이터 규칙](data_rules.md): project JSON, component, style, workspace settings 규칙
- [v1.3 기획안](v1_3_plan.md): 컨테이너 구조, 애니메이션 미리보기, 도킹 작업 패널, 꾸미기 확장 계획

## 함께 보는 공통 문서

- [작업 흐름 설명](../workflow.md)
- [커밋 규칙](../commit_convention.md)
- [PR 작성 규칙](../pr_convention.md)
- [v0 문서 안내](../v0/README.md)

## v1.3 구현 기준

v1.3에서는 다음 항목이 구현 기준이다.

- 박스 제거와 컨테이너 중심 구조 전환
- 기존 `box` 저장 데이터의 `container` 변환
- 컨테이너 안에 컨테이너 추가
- 캔버스 애니메이션 미리보기
- 도킹 작업 패널과 조정/꾸미기/애니메이션/HTML 탭
- 작업 패널 위치, 크기, 도킹 상태를 workspace settings에 저장
- 그라데이션 기준점, 그림자, border, 모서리, 투명도 편집
- 생성 HTML에 v1.3 스타일과 애니메이션 반영
