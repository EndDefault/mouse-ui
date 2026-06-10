# v1 파일 구조 기준

v1은 기능별 책임이 한 파일에 몰리지 않도록 `src/features/builder/` 아래에서 캔버스, 인스펙터, 코드 생성, 저장, 작업 패널을 분리한다.

## 주요 구조

```txt
src/features/builder/
  BuilderPage.jsx
  builder.css

  canvas/
    Canvas.jsx
    CanvasViewport.jsx
    CanvasItemFrame.jsx
    CanvasContextMenu.jsx
    interactions/
      useCanvasPanZoom.js
      useCanvasContextMenu.js
      useCanvasLassoSelection.js
    renderers/
      ButtonCanvasItem.jsx
      TextCanvasItem.jsx
      InputCanvasItem.jsx
      ContainerCanvasItem.jsx
      DivBoxCanvasItem.jsx
      ImageCanvasItem.jsx

  code/
    CodePanel.jsx
    CodeBlock.jsx
    CopyCodeButton.jsx

  codegen/
    generateHtml.js
    generateHtmlForComponent.js
    renderAnimations.js

  inspector/
    InspectorPanel.jsx
    AnimationEditor.jsx
    GradientEditor.jsx
    fields/
      BorderPropertyGroup.jsx
      ColorPropertyGroup.jsx
      NumberInput.jsx
      OpacityProperty.jsx
      RadiusProperty.jsx
      ShadowPropertyGroup.jsx

  model/
    componentTypes.js
    createComponent.js
    styleDefaults.js
    styleValues.js
    updateComponent.js
    canvasPresets.js

  panel/
    DockingPanel.jsx
    LockedComponentsPanel.jsx
    StyleDefaultsPanel.jsx

  state/
    useBuilderState.js

  storage/
    builderStorage.js
    projectSerializer.js

  toolbar/
    Toolbar.jsx
    CanvasSizeControl.jsx
    DivBoxTool.jsx
    ProjectJsonControls.jsx

  workspace/
    useWorkspaceSettings.js
    workspaceSettings.js
```

## 책임 기준

- `canvas/`는 배치, 선택, 드래그, 리사이즈, 컨텍스트 메뉴, 캔버스 애니메이션 미리보기를 담당한다.
- `inspector/`는 선택 요소의 속성 편집 UI를 담당한다.
- `panel/`은 도킹 작업 패널의 탭, 드래그, 리사이즈, 붙이기/떼기를 담당한다.
- `workspace/`는 project JSON과 분리된 작업 환경 설정을 담당한다.
- `model/`은 컴포넌트 생성, 타입, 스타일 변환, 업데이트 로직을 담당한다.
- `storage/`는 project JSON 저장/불러오기와 schema 정규화를 담당한다.
- `codegen/`은 project 데이터를 HTML/CSS 문자열로 변환한다.

## v1.3 관련 기준

- 박스는 새 컴포넌트 타입으로 만들지 않는다.
- 기존 저장 데이터의 `box` 타입 변환은 `storage/projectSerializer.js`에서 처리한다.
- 컨테이너 중첩 렌더링은 `canvas/CanvasItemFrame.jsx`와 `codegen/generateHtmlForComponent.js`에서 같은 `parentId` 관계를 사용한다.
- 그라데이션, 그림자, border, 투명도 변환은 `model/styleValues.js`에 둔다.
- 작업 패널 위치와 크기는 `workspace/useWorkspaceSettings.js`에서 관리한다.

## v1.3.2 관련 기준

- 꾸미기용 `divBox`는 새 컴포넌트 타입으로 관리하되, 컨테이너처럼 자식 요소를 담는 역할은 하지 않는다.
- 숫자 입력 중간 상태는 `inspector/fields/NumberInput.jsx`에서 관리한다.

## v1.4 관련 기준

- 왼쪽 사이드바 없이 `AppLayout`의 toolbar 영역을 생략할 수 있다.
- 잠금 컴포넌트 관리는 `panel/LockedComponentsPanel.jsx`에서 담당한다.
- 기준 스타일 관리는 `panel/StyleDefaultsPanel.jsx`에서 담당한다.
- 기준 스타일 기본값과 병합 로직은 `model/styleDefaults.js`에서 관리한다.
