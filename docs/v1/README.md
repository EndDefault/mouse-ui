# v1 문서 안내

이 폴더는 `mouse-ui`를 단순 배치 도구에서 실제 화면 설계 도구로 확장하기 위한 v1 기획과 구현 기준을 정리한다.

`v0`는 기능 가능성을 확인한 기준점이고, `v1`은 제품 구조와 사용 흐름을 다시 정의하는 단계다. 이 문서는 Codex가 다음 작업을 임의로 확정하기 위한 문서가 아니라, 사용자가 기획을 정하고 구현 기준을 합의하기 위한 초안이다.

## 문서 목록

- [v1 전체 기획안](product_plan.md): 목표, 핵심 방향, 기능 목록, 우선순위
- [v1 작업 흐름](workflow.md): 기획부터 구현, 체크, PR까지의 진행 방식
- [v1 체크리스트](checklist.md): 구현 전 확인 항목과 기능별 완료 기준
- [v1 파일 구조 기준](file_structure.md): 파일이 한 곳에 몰리지 않도록 나누는 기준
- [v1 데이터 규칙](data_rules.md): project/component 데이터, Ollama 템플릿, DB 저장 후보 규칙

## 함께 보는 기존 문서

- [작업 흐름 설명서](../workflow.md)
- [커밋 규칙](../commit_convention.md)
- [PR 작성 규칙](../pr_convention.md)
- [v0 작업 기록](../history/v0.md)

## 사용 순서

1. `product_plan.md`에서 목표와 기능 우선순위를 정한다.
2. `data_rules.md`에서 필요한 데이터 형태를 먼저 확인한다.
3. `file_structure.md`에서 파일 위치를 정한다.
4. `checklist.md`에 구현할 항목을 체크 가능한 단위로 남긴다.
5. 구현이 끝난 뒤 필요한 문서만 갱신하고 PR을 만든다.
