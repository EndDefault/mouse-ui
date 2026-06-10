# v1 데이터 규칙

v1 데이터는 캔버스, 컴포넌트, 스타일, 애니메이션, 저장/불러오기, 이후 Ollama와 DB 연동까지 확장될 수 있어야 한다.

이 문서는 최종 schema가 아니라 v1 기획을 위한 데이터 기준 초안이다.

## 기본 원칙

- UI는 HTML 문자열이 아니라 project 데이터로 관리한다.
- 캔버스 미리보기, Inspector, codegen, 저장/불러오기는 같은 project 데이터를 사용한다.
- 컴포넌트의 종류가 늘어나도 공통 필드는 유지한다.
- 데이터에는 `schemaVersion`을 둔다.
- 불러오기 시 알 수 없는 값은 기본값으로 복구한다.

## project 구조 초안

```js
{
  schemaVersion: 1,
  name: "Untitled",
  canvas: {
    presetId: "desktop-16",
    width: 1536,
    height: 864,
    unit: "px",
    viewport: {
      zoom: 1,
      panX: 0,
      panY: 0
    }
  },
  components: [],
  metadata: {
    createdAt: "2026-06-10T00:00:00.000Z",
    updatedAt: "2026-06-10T00:00:00.000Z"
  }
}
```

## component 구조 초안

```js
{
  id: "component-id",
  type: "button",
  parentId: null,
  name: "Button",
  x: 40,
  y: 40,
  width: 120,
  height: 44,
  props: {
    text: "Button"
  },
  style: {
    background: {
      type: "solid",
      color: "#2563eb",
      gradient: null
    },
    color: "#ffffff",
    borderRadius: 8
  },
  interactions: []
}
```

## 컨테이너 규칙

컨테이너 안에 들어간 요소는 `parentId`로 부모를 참조한다.

```js
{
  id: "text-1",
  type: "text",
  parentId: "container-1",
  x: 24,
  y: 24,
  width: 160,
  height: 32
}
```

규칙:

- `parentId`가 없으면 캔버스 최상위 요소다.
- `parentId`가 있으면 좌표는 부모 컨테이너 기준으로 해석한다.
- 부모 컨테이너를 이동하면 자식 요소는 화면에서 함께 움직인다.
- codegen은 `parentId` 관계를 사용해 중첩 HTML을 만든다.

## 그라데이션 규칙

단일 색상과 그라데이션을 같은 필드에서 구분한다.

```js
{
  background: {
    type: "gradient",
    color: "#2563eb",
    gradient: {
      direction: "to right",
      from: "#2563eb",
      to: "#14b8a6"
    }
  }
}
```

규칙:

- `type`이 `solid`이면 `color`를 사용한다.
- `type`이 `gradient`이면 `gradient`를 사용한다.
- codegen은 `linear-gradient(direction, from, to)` 형태로 변환한다.

## 애니메이션 규칙

이벤트와 애니메이션 효과를 요소별 `interactions`에 저장한다.

```js
{
  interactions: [
    {
      id: "interaction-id",
      event: "hover",
      animation: {
        type: "move",
        to: { x: 20, y: 0 },
        duration: 300,
        easing: "ease"
      }
    }
  ]
}
```

이벤트 후보:

- `hover`
- `click`
- `enter`
- `stateChange`

애니메이션 후보:

- `move`
- `color`
- `flyOut`
- `scale`
- `opacity`

## Ollama 입력 템플릿 초안

Ollama에는 자유로운 설명만 넘기지 않고, 현재 project 데이터와 사용자의 요청을 함께 넘긴다.

```js
{
  task: "modify_ui",
  instruction: "모바일 화면에 로그인 폼을 만들어줘.",
  project: {},
  constraints: {
    allowedComponentTypes: ["container", "button", "text", "input", "image"],
    outputFormat: "project_patch"
  }
}
```

응답은 바로 UI에 반영하기보다 검증 가능한 patch 형태를 우선 검토한다.

```js
{
  type: "project_patch",
  operations: [
    {
      action: "add_component",
      component: {}
    }
  ]
}
```

규칙:

- Ollama 응답은 project schema 검증을 통과해야 반영한다.
- 알 수 없는 component type은 무시하거나 사용자 확인을 받는다.
- 기존 project를 통째로 교체하기보다 patch 방식부터 검토한다.

## DB 저장 규칙 초안

DB 저장은 v1 필수 범위인지 먼저 결정한다. 다만 이후 확장을 위해 아래 구조를 후보로 둔다.

```txt
projects
  id
  name
  schema_version
  current_version_id
  created_at
  updated_at

project_versions
  id
  project_id
  version_number
  project_json
  created_at

ai_requests
  id
  project_id
  instruction
  request_json
  response_json
  created_at
```

규칙:

- 실제 UI 복원 기준은 `project_json`이다.
- DB에는 생성된 HTML 문자열보다 project 데이터를 우선 저장한다.
- AI 요청과 응답은 나중에 재현할 수 있도록 별도 기록한다.
- localStorage와 JSON export는 DB 도입 전까지 같은 project schema를 사용한다.
