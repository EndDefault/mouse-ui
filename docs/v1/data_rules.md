# v1 데이터 규칙

v1 데이터는 사용자가 만든 UI를 복원할 수 있는 project JSON과, 작업 환경을 저장하는 workspace settings로 분리한다.

## 기본 원칙

- project JSON에는 캔버스, 컴포넌트, 선택 상태, 생성에 필요한 스타일과 애니메이션만 저장한다.
- 작업 패널 위치, 크기, 열린 탭, 도킹 여부는 workspace settings에 저장한다.
- 저장 데이터를 불러올 때 알 수 없는 값은 안전한 기본값으로 복구한다.
- 기존 저장 데이터에 남아 있을 수 있는 `box` 타입은 삭제하지 않고 `container`로 변환한다.

## project 구조

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
  selectedId: null,
  selectedIds: [],
  metadata: {
    createdAt: "2026-06-10T00:00:00.000Z",
    updatedAt: "2026-06-10T00:00:00.000Z"
  }
}
```

## component 구조

```js
{
  id: "button-1",
  type: "button",
  parentId: null,
  name: "Button",
  x: 96,
  y: 80,
  width: 132,
  height: 44,
  props: {
    text: "버튼"
  },
  style: {},
  interactions: []
}
```

입력창 props 예시:

```js
{
  label: "이메일",
  showLabel: true,
  placeholder: "이메일을 입력하세요",
  inputType: "email"
}
```

`showLabel`이 false이면 캔버스와 생성 HTML에서 라벨 텍스트를 숨긴다.

지원 타입:

- `container`
- `divBox`
- `button`
- `text`
- `input`
- `image`

legacy 타입:

- `box`는 불러오기 과정에서 `container`로 변환한다.

## 컨테이너 규칙

- `parentId`가 없으면 최상위 캔버스 요소다.
- `parentId`가 있으면 좌표는 부모 컨테이너 기준으로 해석한다.
- 컨테이너 안에는 버튼, 텍스트, input, 이미지, 컨테이너를 넣을 수 있다.
- 컨테이너 안에는 꾸미기용 `divBox`도 넣을 수 있다.
- 컨테이너를 이동하면 내부 요소는 부모 기준 좌표를 유지하므로 화면에서는 함께 이동한다.
- HTML 생성 시 `parentId` 관계를 사용해 중첩된 `<div>` 구조를 만든다.

## 꾸미기용 divBox 규칙

- `divBox`는 자식을 담는 구조용 컨테이너가 아니라 장식용 `<div>`다.
- `divBox`는 배경, 그라데이션, 그림자, border, 모서리, 투명도 편집을 지원한다.
- HTML 생성 시 빈 `<div>`로 출력한다.
- `parentId`가 있으면 부모 컨테이너 기준 좌표로 배치된다.

## style 구조

```js
{
  background: {
    type: "gradient",
    color: "#2563eb",
    gradient: {
      kind: "linear",
      direction: "to right",
      from: "#2563eb",
      to: "#14b8a6",
      fromPosition: 0,
      toPosition: 100
    }
  },
  color: "#ffffff",
  borderRadius: 8,
  opacity: 1,
  shadow: {
    enabled: false,
    x: 0,
    y: 8,
    blur: 18,
    spread: 0,
    color: "#000000",
    opacity: 0.18
  },
  border: {
    enabled: false,
    color: "#d8cfc3",
    width: 1,
    style: "solid"
  }
}
```

규칙:

- `background.type`이 `solid`이면 `background.color`를 사용한다.
- `background.type`이 `gradient`이면 `background.gradient`를 사용한다.
- 그라데이션은 우선 `linear`만 지원한다.
- `fromPosition`과 `toPosition`은 0부터 100 사이의 퍼센트 값이다.
- `shadow.enabled`가 false이면 `box-shadow:none`으로 출력한다.
- `border.enabled`가 false이면 `border:0`으로 출력한다.

## animation 구조

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

지원 이벤트:

- `hover`
- `click`
- `enter`
- `stateChange`

지원 애니메이션:

- `move`
- `color`
- `flyOut`
- `scale`
- `opacity`

## workspace settings 구조

```js
{
  panel: {
    isDocked: true,
    x: 24,
    y: 24,
    width: 380,
    height: 640,
    activeTab: "adjust"
  }
}
```

규칙:

- workspace settings는 localStorage의 `mouse-ui.builder.workspace.v1` 키에 저장한다.
- project JSON export/import에는 workspace settings를 포함하지 않는다.
- 패널 레이아웃 초기화는 workspace settings만 기본값으로 되돌린다.
