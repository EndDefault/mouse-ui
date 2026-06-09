# 파일 구조 및 분리 규칙

이 문서는 Visual UI Code Builder를 구현할 때 한 파일에 코드가 몰리는 일을 막기 위한 강한 기준이다.

목표는 단순히 폴더를 예쁘게 나누는 것이 아니다. **기능 하나를 만들면 그 기능의 위치와 파일 책임이 바로 정해지게 하는 것**이 목표다.

## 1. 핵심 원칙

- 파일 하나에는 주요 책임 하나만 둔다.
- 기능을 추가할 때 새 파일이 생기는 것을 자연스럽게 받아들인다.
- `App.jsx`는 앱 시작점과 큰 연결만 담당한다.
- `components/` 하나에 모든 것을 넣지 않는다.
- 기능 단위는 `features/` 아래에 둔다.
- 공통 UI와 공통 로직은 충분히 반복된 뒤 `shared/` 또는 `global/`로 정리한다.
- `utils.js`, `helpers.js`, `common.js`처럼 역할이 모호한 파일명은 만들지 않는다.

파일이 많은 것은 문제가 아니다. 문제는 파일 하나가 너무 많은 이유를 갖는 것이다.

## 2. 최상위 구조

초기 구현은 다음 구조를 기준으로 한다.

```txt
src/
├─ main.jsx
├─ app/
│  ├─ App.jsx
│  ├─ AppLayout.jsx
│  └─ app.css
├─ features/
│  └─ builder/
│     ├─ BuilderPage.jsx
│     ├─ builder.css
│     ├─ state/
│     ├─ toolbar/
│     ├─ canvas/
│     ├─ inspector/
│     ├─ code/
│     ├─ model/
│     ├─ codegen/
│     └─ storage/
├─ shared/
│  ├─ ui/
│  ├─ hooks/
│  └─ utils/
└─ global/
   ├─ styles/
   └─ constants/
```

각 영역의 의미는 다음과 같다.

- `app/`: 앱 전체 조립, 레이아웃, 최상위 라우팅이 생기면 라우팅 연결
- `features/`: 실제 기능 단위 코드
- `shared/`: 여러 기능에서 재사용되는 UI, hook, 작은 유틸
- `global/`: 앱 전체에서 변하지 않는 디자인 토큰, 전역 스타일, 전역 상수

처음부터 모든 폴더를 꽉 채우지 않는다. 하지만 새 기능을 만들 때는 이 구조 안에서 위치를 정한다.

## 3. App 파일 규칙

### `src/app/App.jsx`

담당하는 것:

- 앱의 최상위 컴포넌트
- `AppLayout` 또는 `BuilderPage` 연결
- 전역 provider가 필요해질 때 provider 연결

담당하지 않는 것:

- `components` 상태 직접 관리
- 캔버스 요소 렌더링
- 코드 생성
- 컴포넌트 기본 데이터 생성
- 저장, 불러오기 세부 로직
- 속성 패널 입력 처리

`App.jsx`는 80줄을 넘기지 않는 것을 목표로 한다.

### `src/app/AppLayout.jsx`

담당하는 것:

- 상단, 왼쪽, 가운데, 오른쪽 영역의 큰 배치
- 앱 전체 레이아웃 className 구성

담당하지 않는 것:

- 각 영역 안의 세부 기능
- 컴포넌트 추가 로직
- 코드 생성 로직

## 4. Builder 기능 구조

UI 빌더의 핵심 기능은 `src/features/builder/` 아래에 둔다.

```txt
features/
└─ builder/
   ├─ BuilderPage.jsx
   ├─ builder.css
   ├─ state/
   │  └─ useBuilderState.js
   ├─ toolbar/
   │  ├─ Toolbar.jsx
   │  ├─ ToolButton.jsx
   │  ├─ ButtonTool.jsx
   │  ├─ TextTool.jsx
   │  ├─ InputTool.jsx
   │  ├─ BoxTool.jsx
   │  └─ CardTool.jsx
   ├─ canvas/
   │  ├─ Canvas.jsx
   │  ├─ CanvasViewport.jsx
   │  ├─ CanvasEmptyState.jsx
   │  ├─ CanvasItemFrame.jsx
   │  └─ renderers/
   │     ├─ ButtonCanvasItem.jsx
   │     ├─ TextCanvasItem.jsx
   │     ├─ InputCanvasItem.jsx
   │     ├─ BoxCanvasItem.jsx
   │     └─ CardCanvasItem.jsx
   ├─ inspector/
   │  ├─ InspectorPanel.jsx
   │  ├─ EmptyInspector.jsx
   │  └─ fields/
   │     ├─ PropertyRow.jsx
   │     ├─ TextProperty.jsx
   │     ├─ PositionPropertyGroup.jsx
   │     ├─ SizePropertyGroup.jsx
   │     ├─ ColorPropertyGroup.jsx
   │     └─ RadiusProperty.jsx
   ├─ code/
   │  ├─ CodePanel.jsx
   │  ├─ CodeBlock.jsx
   │  └─ CopyCodeButton.jsx
   ├─ model/
   │  ├─ componentTypes.js
   │  ├─ createComponent.js
   │  ├─ defaultComponentStyles.js
   │  └─ updateComponent.js
   ├─ codegen/
   │  ├─ generateHtml.js
   │  ├─ generateHtmlForComponent.js
   │  └─ escapeHtml.js
   └─ storage/
      ├─ builderStorage.js
      └─ projectSerializer.js
```

## 5. BuilderPage 규칙

### `BuilderPage.jsx`

담당하는 것:

- 빌더 화면의 기능 조립
- `useBuilderState` 호출
- `Toolbar`, `Canvas`, `InspectorPanel`, `CodePanel` 연결
- 각 컴포넌트에 필요한 props 전달

담당하지 않는 것:

- 버튼 기본 데이터 생성
- 타입별 캔버스 렌더링
- HTML 문자열 생성
- localStorage 직접 접근
- 속성 입력 UI 세부 구현

`BuilderPage.jsx`는 120줄을 넘기지 않는 것을 목표로 한다.

## 6. 상태 파일 규칙

### `state/useBuilderState.js`

담당하는 것:

- `components` 상태
- `selectedId` 상태
- 컴포넌트 추가
- 컴포넌트 선택
- 컴포넌트 업데이트
- 컴포넌트 삭제가 필요해지면 삭제

담당하지 않는 것:

- JSX 렌더링
- HTML 코드 생성
- localStorage 세부 구현
- 버튼, 텍스트 같은 타입별 기본 데이터 직접 작성

상태 hook 안에서 새 컴포넌트를 만들 때는 `createComponent(type)`을 호출한다.

## 7. Toolbar 파일 규칙

툴바에는 도구 버튼이 많아질 수 있으므로 도구마다 파일을 만든다.

### `toolbar/Toolbar.jsx`

담당하는 것:

- 도구 목록 배치
- `ButtonTool`, `TextTool`, `InputTool` 같은 개별 도구 조립

담당하지 않는 것:

- 직접 `<button>`을 여러 개 길게 나열
- 컴포넌트 기본 데이터 생성
- 캔버스 상태 변경

### `toolbar/ToolButton.jsx`

담당하는 것:

- 도구 버튼의 공통 UI
- 아이콘, 라벨, 클릭 처리 모양 통일

### 개별 도구 파일

각 도구는 반드시 개별 파일로 만든다.

```txt
ButtonTool.jsx
TextTool.jsx
InputTool.jsx
BoxTool.jsx
CardTool.jsx
```

각 도구 파일이 담당하는 것:

- 자기 타입의 추가 버튼 렌더링
- 클릭 시 `onAdd(type)` 호출

담당하지 않는 것:

- 다른 도구 렌더링
- 기본 데이터 생성
- 코드 생성

예를 들어 버튼 추가 기능은 `ButtonTool.jsx`에 둔다. `Toolbar.jsx` 안에 버튼 추가 JSX를 직접 길게 쓰지 않는다.

## 8. Canvas 파일 규칙

캔버스는 쉽게 커지는 영역이므로 프레임, 뷰포트, 타입별 렌더러를 분리한다.

### `canvas/Canvas.jsx`

담당하는 것:

- 캔버스 영역 조립
- 빈 상태와 뷰포트 표시 결정
- `CanvasViewport`에 컴포넌트 목록 전달

### `canvas/CanvasViewport.jsx`

담당하는 것:

- 실제 작업 영역
- 컴포넌트 목록을 순회해서 `CanvasItemFrame` 렌더링
- 캔버스 배경, 크기, 클릭 시 선택 해제 처리

### `canvas/CanvasEmptyState.jsx`

담당하는 것:

- 컴포넌트가 없을 때 보여줄 안내 UI

### `canvas/CanvasItemFrame.jsx`

담당하는 것:

- 위치, 크기, 선택 테두리 같은 공통 프레임
- 클릭 시 선택 이벤트
- 드래그와 리사이즈가 추가되면 공통 동작 연결
- 타입별 렌더러 호출

담당하지 않는 것:

- 버튼, 텍스트, 입력창의 실제 내부 모양을 모두 직접 구현

### `canvas/renderers/*CanvasItem.jsx`

타입별 렌더링은 반드시 별도 파일로 만든다.

```txt
ButtonCanvasItem.jsx
TextCanvasItem.jsx
InputCanvasItem.jsx
BoxCanvasItem.jsx
CardCanvasItem.jsx
```

각 파일은 자기 타입의 캔버스 렌더링만 담당한다.

`CanvasItemFrame.jsx`에 `if button`, `if text`, `if input` 같은 렌더링 코드가 길게 쌓이면 안 된다.

## 9. Inspector 파일 규칙

속성 패널은 입력 항목이 많아지므로 필드 단위로 나눈다.

### `inspector/InspectorPanel.jsx`

담당하는 것:

- 선택된 요소가 있는지 확인
- 선택된 요소가 없으면 `EmptyInspector` 표시
- 선택된 요소가 있으면 속성 필드 그룹 표시

담당하지 않는 것:

- 모든 input JSX를 직접 길게 작성
- 컴포넌트 업데이트 로직 직접 구현

### `inspector/fields/PropertyRow.jsx`

담당하는 것:

- label과 input을 한 줄로 배치하는 공통 행

### 속성별 파일

속성 그룹은 반드시 파일로 분리한다.

```txt
TextProperty.jsx
PositionPropertyGroup.jsx
SizePropertyGroup.jsx
ColorPropertyGroup.jsx
RadiusProperty.jsx
```

각 파일은 자기 속성만 담당한다.

예를 들어 `PositionPropertyGroup.jsx`는 `x`, `y` 입력만 담당한다. 색상 입력까지 같이 넣지 않는다.

## 10. Code 파일 규칙

### `code/CodePanel.jsx`

담당하는 것:

- 코드 패널 조립
- `CodeBlock`과 `CopyCodeButton` 배치
- 생성된 코드 문자열 전달

담당하지 않는 것:

- HTML 코드 직접 생성
- 클립보드 API 직접 구현이 길어지는 것

### `code/CodeBlock.jsx`

담당하는 것:

- 코드 텍스트 표시
- 빈 코드 상태 표시

### `code/CopyCodeButton.jsx`

담당하는 것:

- 코드 복사 버튼
- 복사 성공, 실패 피드백

복사 로직이 다른 곳에서도 쓰이면 `shared/hooks/useClipboard.js`로 이동한다.

## 11. Model 파일 규칙

데이터 모델과 상태 업데이트 로직은 화면 파일에 넣지 않는다.

### `model/componentTypes.js`

컴포넌트 타입 문자열만 관리한다.

```js
export const COMPONENT_TYPES = {
  BUTTON: "button",
  TEXT: "text",
  INPUT: "input",
  BOX: "box",
  CARD: "card"
};
```

### `model/createComponent.js`

새 컴포넌트 기본 데이터를 만든다.

담당하는 것:

- 타입별 기본값 생성
- id 생성 호출
- 기본 위치, 크기, 텍스트, 스타일 설정

담당하지 않는 것:

- React 상태 변경
- JSX 렌더링

### `model/defaultComponentStyles.js`

타입별 기본 스타일을 관리한다.

### `model/updateComponent.js`

컴포넌트 수정 로직을 관리한다.

담당하는 것:

- 특정 id의 컴포넌트 찾기
- 위치 변경
- 크기 변경
- 텍스트 변경
- style 일부 변경

`setComponents(components.map(...))`가 여러 파일에 반복되면 반드시 이 파일로 모은다.

## 12. Codegen 파일 규칙

코드 생성은 화면과 완전히 분리한다.

### `codegen/generateHtml.js`

담당하는 것:

- 전체 컴포넌트 배열을 HTML 문자열로 변환

### `codegen/generateHtmlForComponent.js`

담당하는 것:

- 컴포넌트 한 개를 타입별 HTML 문자열로 변환

### `codegen/escapeHtml.js`

담당하는 것:

- 사용자가 입력한 텍스트 escape 처리

`CodePanel.jsx` 안에서 HTML 문자열을 만들지 않는다.

## 13. Storage 파일 규칙

저장과 불러오기는 처음에는 없지만, 기능이 생기면 반드시 분리한다.

### `storage/builderStorage.js`

담당하는 것:

- localStorage 저장
- localStorage 불러오기
- localStorage 삭제

### `storage/projectSerializer.js`

담당하는 것:

- 프로젝트 데이터를 JSON 문자열로 변환
- JSON 문자열을 프로젝트 데이터로 복원
- 기본 검증

## 14. Shared와 Global 정규화 규칙

처음부터 모든 것을 공통화하지 않는다. 먼저 기능 폴더 안에서 만들고, 반복이 확인되면 정규화한다.

### `shared/`

여러 feature에서 재사용되는 코드만 둔다.

예시:

```txt
shared/
├─ ui/
│  ├─ Button.jsx
│  ├─ IconButton.jsx
│  ├─ Panel.jsx
│  ├─ TextInput.jsx
│  ├─ NumberInput.jsx
│  └─ ColorInput.jsx
├─ hooks/
│  └─ useClipboard.js
└─ utils/
   └─ createId.js
```

`shared`로 옮기는 기준:

- 같은 UI가 3곳 이상 반복된다.
- 같은 hook이 2개 이상 feature에서 필요하다.
- 특정 feature 이름 없이도 의미가 분명하다.

### `global/`

앱 전체 기준만 둔다.

예시:

```txt
global/
├─ styles/
│  ├─ reset.css
│  ├─ tokens.css
│  └─ base.css
└─ constants/
   └─ appConfig.js
```

`global`에 넣으면 안 되는 것:

- 빌더 기능 전용 로직
- 특정 컴포넌트 타입 처리
- 캔버스 렌더링 코드
- 코드 생성 로직

## 15. 새 기능 추가 시 필수 파일 규칙

새 컴포넌트 타입을 추가하면 다음 파일을 확인한다.

예를 들어 `image` 컴포넌트를 추가한다면:

```txt
toolbar/ImageTool.jsx
canvas/renderers/ImageCanvasItem.jsx
model/componentTypes.js
model/createComponent.js
model/defaultComponentStyles.js
codegen/generateHtmlForComponent.js
inspector/fields/ImagePropertyGroup.jsx
```

규칙:

- 툴바 버튼은 `TypeTool.jsx` 파일로 만든다.
- 캔버스 렌더러는 `TypeCanvasItem.jsx` 파일로 만든다.
- 속성 입력이 2개 이상이면 `TypePropertyGroup.jsx` 파일로 만든다.
- 기본 데이터는 `createComponent.js`에 추가한다.
- 타입 문자열은 `componentTypes.js`에 추가한다.
- HTML 생성은 `generateHtmlForComponent.js`에 추가한다.

새 기능이 이 파일 규칙을 따르기 어렵다면 기능 범위가 너무 큰지 먼저 확인한다.

## 16. 파일 크기 제한

엄격한 기준은 다음과 같다.

| 파일 종류 | 권장 최대 줄 수 |
| --- | ---: |
| `App.jsx` | 80줄 |
| `BuilderPage.jsx` | 120줄 |
| 일반 화면 컴포넌트 | 120줄 |
| 작은 UI 컴포넌트 | 80줄 |
| hook 파일 | 120줄 |
| model 파일 | 150줄 |
| codegen 파일 | 150줄 |
| CSS 파일 | 250줄 |

제한을 넘으면 바로 잘라내라는 뜻은 아니지만, 다음 작업 전에 분리를 검토한다.

## 17. 파일명 규칙

- React 컴포넌트 파일은 PascalCase를 사용한다.
- hook은 `use`로 시작한다.
- model, codegen, storage 함수 파일은 동사로 시작한다.
- 모호한 이름을 피한다.

좋은 예:

```txt
ButtonTool.jsx
ButtonCanvasItem.jsx
PositionPropertyGroup.jsx
generateHtml.js
createComponent.js
updateComponent.js
builderStorage.js
```

피할 예:

```txt
utils.js
helpers.js
common.js
items.jsx
panel.jsx
data.js
functions.js
```

## 18. import 규칙

- 같은 feature 내부 import는 가까운 파일끼리 한다.
- `features/builder` 내부 파일이 다른 feature 내부 파일을 직접 import하지 않는다.
- `shared`와 `global`은 어디서든 import할 수 있다.
- `shared`가 `features`를 import하면 안 된다.
- `global`이 `features`나 `shared`를 import하면 안 된다.

의존 방향은 다음과 같다.

```txt
app
  -> features
  -> shared
  -> global
```

반대 방향 import는 만들지 않는다.

## 19. v0.1.0에서 만들 파일

`v0.1.0`은 기본 흐름만 만들지만, 파일 분리 규칙은 처음부터 적용한다.

```txt
src/
├─ main.jsx
├─ app/
│  ├─ App.jsx
│  ├─ AppLayout.jsx
│  └─ app.css
└─ features/
   └─ builder/
      ├─ BuilderPage.jsx
      ├─ builder.css
      ├─ state/
      │  └─ useBuilderState.js
      ├─ toolbar/
      │  ├─ Toolbar.jsx
      │  ├─ ToolButton.jsx
      │  └─ ButtonTool.jsx
      ├─ canvas/
      │  ├─ Canvas.jsx
      │  ├─ CanvasViewport.jsx
      │  ├─ CanvasEmptyState.jsx
      │  ├─ CanvasItemFrame.jsx
      │  └─ renderers/
      │     └─ ButtonCanvasItem.jsx
      ├─ code/
      │  ├─ CodePanel.jsx
      │  └─ CodeBlock.jsx
      ├─ model/
      │  ├─ componentTypes.js
      │  └─ createComponent.js
      └─ codegen/
         ├─ generateHtml.js
         ├─ generateHtmlForComponent.js
         └─ escapeHtml.js
```

`v0.1.0`에서는 아직 만들지 않는 파일:

- `InspectorPanel.jsx`
- `CopyCodeButton.jsx`
- `TextTool.jsx`
- `InputTool.jsx`
- `builderStorage.js`
- `projectSerializer.js`
- `shared/ui/*`
- `global/styles/*`

필요한 순간에 버전 체크리스트에 맞춰 추가한다.

## 20. 최종 확인 규칙

작업을 마친 뒤 다음 질문에 답할 수 있어야 한다.

- 이 파일의 책임을 한 문장으로 말할 수 있는가?
- 이 파일 이름만 보고 역할을 짐작할 수 있는가?
- 이 파일에 다른 기능의 코드가 섞이지 않았는가?
- 같은 코드가 2번 이상 반복되지는 않는가?
- 반복된 코드를 `shared`나 `global`로 옮기기에는 아직 이르지 않은가?
- 현재 버전 체크리스트에 없는 기능을 몰래 만들지 않았는가?

이 질문 중 하나라도 애매하면 파일을 더 나누거나, 다음 버전으로 미룬다.
