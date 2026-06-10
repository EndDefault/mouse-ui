# v1 파일 구조 기준

v1에서는 기능이 커지므로 한 파일에 상태, UI, 렌더링, 코드 생성이 몰리지 않게 한다.

## 기본 원칙

- 파일은 책임 단위로 나눈다.
- 컴포넌트 정의, 캔버스 렌더링, Inspector, codegen, 저장 로직을 섞지 않는다.
- 하나의 파일이 여러 기능을 동시에 설명하기 시작하면 분리한다.
- 새 기능은 먼저 위치를 정하고 구현한다.

## 권장 구조

```txt
src/features/builder/
  canvas/
    CanvasViewport.jsx
    CanvasSurface.jsx
    CanvasItemFrame.jsx
    interactions/
      useCanvasPanZoom.js
      useCanvasContextMenu.js
    renderers/
      ButtonRenderer.jsx
      TextRenderer.jsx
      InputRenderer.jsx
      ContainerRenderer.jsx

  components/
    definitions/
      buttonDefinition.js
      textDefinition.js
      inputDefinition.js
      containerDefinition.js
    createComponent.js

  inspector/
    InspectorPanel.jsx
    InspectorField.jsx
    GradientEditor.jsx
    AnimationEditor.jsx

  codegen/
    generateHtml.js
    renderComponentHtml.js
    renderStyles.js
    renderAnimations.js

  storage/
    builderStorage.js
    projectSerializer.js
    projectSchema.js

  toolbar/
    Toolbar.jsx
    CanvasSizeControl.jsx
    ProjectJsonControls.jsx

  model/
    componentTypes.js
    canvasPresets.js
```

## 기능별 위치

| 기능 | 주요 위치 |
| --- | --- |
| 캔버스 이동 / 줌 | `canvas/interactions`, `canvas/CanvasViewport.jsx` |
| 화면 크기 지정 | `model/canvasPresets.js`, `toolbar/CanvasSizeControl.jsx` |
| 컨테이너 내부 요소 | `components/definitions`, `canvas/renderers`, `codegen` |
| 우클릭 메뉴 | `canvas/interactions/useCanvasContextMenu.js` |
| 그라데이션 | `inspector/GradientEditor.jsx`, `codegen/renderStyles.js` |
| 애니메이션 | `inspector/AnimationEditor.jsx`, `codegen/renderAnimations.js` |
| 저장/불러오기 | `storage/projectSerializer.js`, `storage/projectSchema.js` |

## 분리 기준

- 같은 파일 안에 이벤트 처리와 렌더링 JSX가 모두 길어지면 이벤트 처리를 hook으로 분리한다.
- 같은 파일 안에 컴포넌트별 분기가 많아지면 definition 또는 renderer로 분리한다.
- Inspector 필드가 컴포넌트마다 달라지면 필드 정의를 데이터로 분리한다.
- codegen에서 style, animation, nested HTML 처리가 섞이면 렌더 함수를 나눈다.
- 저장/불러오기 검증 로직은 UI 파일에 두지 않는다.

## 문서와 코드 연결

새 기능을 만들 때는 아래 순서로 확인한다.

1. `docs/v1/product_plan.md`에서 기능 목적을 확인한다.
2. `docs/v1/data_rules.md`에서 필요한 데이터 형태를 확인한다.
3. 이 문서에서 파일 위치를 정한다.
4. 구현 후 `docs/v1/checklist.md`에서 완료 기준을 확인한다.
