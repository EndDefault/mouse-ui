# 개발 방향 및 규칙

이 문서는 Visual UI Code Builder를 구현할 때 흔들리지 않기 위한 개발 기준을 정리한다.

## 1. 기본 개발 방향

- 이 프로젝트는 코드 편집기가 아니라 UI 데이터 편집기이다.
- `components` 데이터가 화면과 코드의 기준이다.
- 캔버스 미리보기와 코드 패널은 같은 데이터를 바라본다.
- 사용자가 직접 작성해야 하는 코드는 최소화한다.
- 첫 버전은 기능을 넓히기보다 핵심 흐름을 안정적으로 만든다.

핵심 흐름은 다음과 같다.

```txt
컴포넌트 추가
  -> components 배열에 데이터 추가
  -> Canvas가 데이터 렌더링
  -> CodePanel이 데이터 기반 HTML 생성
```

## 2. 상태 관리 규칙

초기 상태는 단순하게 유지한다.

```js
const [components, setComponents] = useState([]);
const [selectedId, setSelectedId] = useState(null);
```

상태 관리 규칙은 다음과 같다.

- 컴포넌트 추가, 수정, 삭제는 항상 `setComponents`로 처리한다.
- 선택 상태는 `selectedId` 하나로 관리한다.
- 개별 컴포넌트가 자기 상태를 따로 들고 있지 않게 한다.
- `CanvasItemFrame`은 props를 받아 공통 프레임을 렌더링하고 이벤트를 위로 올린다.
- 코드 생성기는 React 상태를 직접 바꾸지 않는 순수 함수로 둔다.

## 3. 컴포넌트 데이터 규칙

모든 컴포넌트는 공통 필드를 가진다.

```js
{
  id: "button-1",
  type: "button",
  x: 100,
  y: 100,
  width: 120,
  height: 40,
  style: {}
}
```

데이터 작성 규칙은 다음과 같다.

- `id`는 컴포넌트 타입과 번호를 조합한다.
- `type`은 `button`, `text`, `input`, `card`, `box` 같은 문자열 상수로 관리한다.
- 위치와 크기는 숫자 픽셀 값으로 저장한다.
- 색상은 hex 문자열을 기본으로 사용한다.
- 이벤트는 처음에는 버튼에만 제한한다.

## 4. 기능 추가 규칙

새 컴포넌트 타입을 추가할 때는 다음 순서를 따른다.

1. `features/builder/model/componentTypes.js`에 타입 추가
2. `features/builder/model/createComponent.js`에 기본 데이터 추가
3. `features/builder/toolbar/TypeTool.jsx` 파일 추가
4. `features/builder/toolbar/Toolbar.jsx`에 새 도구 연결
5. `features/builder/canvas/renderers/TypeCanvasItem.jsx` 파일 추가
6. `features/builder/canvas/CanvasItemFrame.jsx`에 렌더러 연결
7. `features/builder/inspector/fields/TypePropertyGroup.jsx`가 필요하면 추가
8. `features/builder/codegen/generateHtmlForComponent.js`에 HTML 생성 로직 추가

이 순서를 따르면 화면, 데이터, 코드 생성이 서로 어긋나는 일을 줄일 수 있다.

## 5. 코드 생성 규칙

1차 버전의 코드 생성은 HTML + inline CSS를 기준으로 한다.

- `generateHtml(components)`는 문자열만 반환한다.
- 코드 생성 함수 안에서 DOM을 조작하지 않는다.
- 컴포넌트 배열 순서대로 코드를 생성한다.
- 사용자가 입력한 텍스트는 HTML에서 깨지지 않도록 escape 처리를 검토한다.
- 선택된 요소 표시는 코드 생성 결과에 주석으로 넣을 수 있지만, 실제 복사용 코드에서는 제외할 수 있게 한다.

예상 출력 예시는 다음과 같다.

```html
<button style="position:absolute; left:100px; top:80px; width:120px; height:40px;">
  로그인
</button>
```

## 6. UI 규칙

초기 화면은 실제 편집기를 바로 보여준다. 별도의 랜딩 페이지나 소개 화면을 만들지 않는다.

화면 구성 규칙은 다음과 같다.

- 상단 메뉴, 왼쪽 툴바, 가운데 캔버스, 오른쪽 패널 구조를 유지한다.
- 왼쪽 툴바는 컴포넌트 추가에 집중한다.
- 가운데 캔버스는 배치와 선택에 집중한다.
- 오른쪽 패널은 속성 수정과 코드 확인에 집중한다.
- 선택된 요소는 캔버스에서 명확한 테두리로 표시한다.
- 속성 입력은 텍스트 입력, 숫자 입력, 색상 입력처럼 익숙한 컨트롤을 사용한다.
- 버튼, 패널, 입력창의 크기는 텍스트가 잘리지 않도록 고정 폭과 반응형 제약을 둔다.

## 7. 파일 구조 규칙

처음 구현은 다음 구조를 기준으로 한다.

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
└─ global/
```

파일 역할은 작게 유지한다.

- `app` 폴더는 앱 전체 조립을 담당한다.
- `features` 폴더는 실제 기능 단위 코드를 담당한다.
- `features/builder`는 UI 빌더 기능만 담당한다.
- `model` 폴더는 컴포넌트 데이터와 업데이트 규칙을 담당한다.
- `codegen` 폴더는 화면과 분리된 코드 생성 로직을 담당한다.
- `shared` 폴더는 여러 기능에서 반복되는 UI와 hook을 담당한다.
- `global` 폴더는 전역 스타일과 앱 전체 상수를 담당한다.
- 큰 기능을 만들기 전까지 전역 상태 라이브러리는 사용하지 않는다.
- 자세한 파일 분리 기준은 `docs/v0/file_structure_rules.md`를 따른다.

## 8. MVP 구현 우선순위

가장 먼저 완성해야 하는 흐름은 다음과 같다.

```txt
버튼 추가
  -> 버튼 선택
  -> 코드 생성
```

그 다음 순서로 확장한다.

1. 드래그 이동
2. 크기 조절
3. 속성 수정
4. 텍스트와 입력창 추가
5. 코드 복사
6. localStorage 저장

MVP가 끝나기 전에는 React 코드 생성, AI 기능, 템플릿 기능을 추가하지 않는다.

## 9. 커밋 규칙

커밋 메시지는 `docs/commit_convention.md`의 Gitmoji 규칙을 따른다.

기본 형식은 다음과 같다.

```txt
<깃모지> <작업 분류> : <작업 내용>
```

예시는 다음과 같다.

```txt
📝 문서 수정 : 프로젝트 기획서 정리
🎉 초기 설정 : React 프로젝트 생성
✨ 기능 추가 : 버튼 추가 기능 구현
💄 UI 수정 : 캔버스 레이아웃 개선
```

## 10. 지금 지키지 않을 것

초기 구현에서 일부러 하지 않을 것도 정해둔다.

- 처음부터 완벽한 디자인 시스템을 만들지 않는다.
- 처음부터 코드 에디터 라이브러리를 붙이지 않는다.
- 처음부터 저장 파일 포맷을 복잡하게 만들지 않는다.
- 처음부터 모든 HTML 태그를 지원하지 않는다.
- 처음부터 반응형 편집기를 만들지 않는다.

이 프로젝트는 작은 기능을 완성하고, 그 위에 확장하는 방식으로 키운다.
