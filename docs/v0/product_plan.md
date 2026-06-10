# Visual UI Code Builder 기획서

## 1. 프로젝트 정의

**Visual UI Code Builder**는 사용자가 마우스로 UI 요소를 배치하고 수정하면, 그 결과를 HTML/CSS 또는 React 코드로 변환해 주는 비주얼 UI 제작 도구이다.

한글 이름은 **눈으로 만드는 UI 코드 생성기**로 둔다.

이 프로젝트의 핵심은 단순한 그림판이 아니라, 화면에서 편집한 UI를 내부 데이터로 관리하고 그 데이터를 기준으로 미리보기와 코드를 동시에 생성하는 것이다.

```txt
사용자 조작
  -> UI 데이터 변경
  -> 캔버스 미리보기 갱신
  -> 코드 패널 갱신
```

## 2. 프로젝트 방향성

이 프로젝트는 처음부터 완성형 디자인 툴을 목표로 하지 않는다. 1차 목표는 작은 UI 빌더를 안정적으로 만들고, 이후 코드 생성 형식과 컴포넌트 종류를 확장하는 것이다.

중요한 방향은 다음과 같다.

- 사용자는 코드를 먼저 작성하지 않고 화면을 먼저 조작한다.
- 화면에 보이는 UI와 생성되는 코드는 같은 데이터에서 나온다.
- MVP에서는 HTML + inline CSS 생성을 우선한다.
- React 코드 생성, 템플릿, AI 자동 배치는 나중에 붙인다.
- 기능은 화려함보다 이해하기 쉬운 구조와 실시간 피드백을 우선한다.

## 3. 해결하려는 문제

HTML, CSS, JavaScript를 처음 배우는 사용자는 버튼 하나를 만들 때도 태그, 스타일, 위치, 이벤트를 따로 작성해야 한다. 이 과정은 반복적이고 결과를 바로 상상하기 어렵다.

이 프로젝트는 사용자가 UI를 직접 배치하고 조정하면서, 그 결과가 어떤 코드로 표현되는지 즉시 확인하게 해준다.

즉, 이 도구는 다음 두 가지 목적을 가진다.

- UI를 빠르게 시각적으로 구성한다.
- 시각적 조작이 코드로 어떻게 바뀌는지 학습한다.

## 4. 핵심 사용자 경험

사용자는 왼쪽 툴바에서 컴포넌트를 추가한다. 가운데 캔버스에서는 요소를 선택하고 이동하고 크기를 조절한다. 오른쪽 패널에서는 선택한 요소의 속성을 수정하고 생성된 코드를 확인한다.

기본 화면 구조는 다음과 같다.

```txt
┌──────────────────────────────────────────────────────────────┐
│ 상단 메뉴                                                     │
│ [새 프로젝트] [저장] [불러오기] [코드 복사]                    │
├───────────────┬───────────────────────────┬──────────────────┤
│ 왼쪽 툴바      │ 가운데 캔버스              │ 오른쪽 패널        │
│               │                           │                  │
│ 버튼 추가      │ 실제 UI를 배치하는 영역      │ 속성 수정          │
│ 텍스트 추가    │                           │ 코드 미리보기      │
│ 입력창 추가    │                           │                  │
└───────────────┴───────────────────────────┴──────────────────┘
```

## 5. MVP 범위

1차 MVP는 다음 기능을 완성 목표로 한다.

- 버튼 추가
- 텍스트 추가
- 입력창 추가
- 요소 선택
- 선택한 요소 테두리 표시
- 마우스로 위치 이동
- 마우스로 크기 조절
- 속성 패널에서 텍스트, 위치, 크기, 색상 수정
- 오른쪽 코드 패널에 HTML 코드 실시간 표시
- 생성된 코드 복사
- localStorage 기반 임시 저장

1차 MVP에서 제외할 기능은 다음과 같다.

- Monaco Editor 또는 CodeMirror 적용
- React JSX 코드 생성
- Tailwind CSS 코드 생성
- Vue 코드 생성
- AI 자동 UI 생성
- 복잡한 이벤트 빌더
- 그룹화, 레이어 패널, Undo/Redo
- 반응형 브레이크포인트 편집

## 6. 데이터 구조

모든 UI는 코드 문자열이 아니라 데이터로 관리한다. 이 데이터가 프로젝트의 단일 기준점이다.

```js
const project = {
  name: "login-page",
  width: 1200,
  height: 800,
  components: []
};
```

컴포넌트 공통 필드는 다음과 같다.

```js
{
  id: "button-1",
  type: "button",
  x: 100,
  y: 80,
  width: 120,
  height: 40,
  style: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: 8,
    fontSize: 16
  }
}
```

버튼은 텍스트와 이벤트를 가질 수 있다.

```js
{
  id: "button-1",
  type: "button",
  text: "로그인",
  x: 100,
  y: 80,
  width: 120,
  height: 40,
  style: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: 8,
    fontSize: 16
  },
  event: {
    type: "alert",
    message: "로그인 버튼 클릭"
  }
}
```

입력창은 label, placeholder, inputType을 가진다.

```js
{
  id: "input-1",
  type: "input",
  label: "이메일",
  placeholder: "이메일을 입력하세요",
  inputType: "email",
  x: 80,
  y: 120,
  width: 240,
  height: 40
}
```

## 7. 코드 생성 방식

처음에는 HTML + inline CSS를 생성한다. 사용자가 UI를 수정할 때마다 `components` 배열을 다시 읽어 HTML 문자열을 만든다.

```js
function generateHtml(components) {
  return components.map(component => {
    if (component.type === "button") {
      return `<button style="position:absolute; left:${component.x}px; top:${component.y}px; width:${component.width}px; height:${component.height}px;">${component.text}</button>`;
    }

    if (component.type === "text") {
      return `<p style="position:absolute; left:${component.x}px; top:${component.y}px;">${component.text}</p>`;
    }

    return "";
  }).join("\n");
}
```

추후에는 같은 데이터를 기준으로 다음 코드 형식을 추가한다.

- HTML + CSS 분리
- React JSX
- Tailwind CSS

## 8. 예상 폴더 구조

```txt
mouse-ui/
├─ package.json
├─ index.html
├─ src/
│  ├─ main.jsx
│  ├─ app/
│  │  ├─ App.jsx
│  │  ├─ AppLayout.jsx
│  │  └─ app.css
│  ├─ features/
│  │  └─ builder/
│  │     ├─ BuilderPage.jsx
│  │     ├─ builder.css
│  │     ├─ state/
│  │     ├─ toolbar/
│  │     ├─ canvas/
│  │     ├─ inspector/
│  │     ├─ code/
│  │     ├─ model/
│  │     ├─ codegen/
│  │     └─ storage/
│  ├─ shared/
│  └─ global/
└─ docs/
```

각 파일의 역할은 다음과 같다.

- `app/`: 앱 시작점, 전체 레이아웃, 최상위 연결
- `features/builder/`: UI 빌더 기능 전체
- `features/builder/state/`: 빌더 상태 hook
- `features/builder/toolbar/`: 컴포넌트 추가 도구
- `features/builder/canvas/`: 캔버스와 캔버스 요소 렌더링
- `features/builder/inspector/`: 선택한 요소 속성 수정
- `features/builder/code/`: 생성된 코드 표시와 복사
- `features/builder/model/`: 컴포넌트 타입, 기본 데이터, 업데이트 로직
- `features/builder/codegen/`: UI 데이터를 코드 문자열로 변환
- `features/builder/storage/`: 저장과 불러오기
- `shared/`: 여러 기능에서 반복되는 UI와 hook
- `global/`: 전역 스타일, 디자인 토큰, 앱 전체 상수

## 9. 개발 단계

### 1단계: 기본 구조

- React 프로젝트 세팅
- 3분할 레이아웃 구성
- 버튼 추가
- 버튼 선택
- HTML 코드 표시

### 2단계: 이동과 크기 조절

- `react-rnd` 적용
- 요소 드래그 이동
- 요소 리사이즈
- 위치와 크기 변경 시 코드 자동 갱신

### 3단계: 속성 패널

- 선택한 요소 정보 표시
- 텍스트 수정
- 위치, 크기 직접 입력
- 배경색, 글자색, 둥근 정도 수정

### 4단계: 컴포넌트 확장

- 텍스트 추가
- 입력창 추가
- 카드 추가
- 박스 추가

### 5단계: 저장과 복사

- 코드 복사
- localStorage 자동 저장
- JSON 내보내기와 불러오기

### 6단계: 코드 생성 확장

- HTML/CSS 분리 생성
- React JSX 생성
- 이후 Tailwind CSS 생성 검토

## 10. 확장 아이디어

MVP 이후에는 다음 기능을 검토한다.

- 로그인 페이지 템플릿
- 회원가입 페이지 템플릿
- 게시판 화면 템플릿
- 반응형 화면 지원
- 컴포넌트 그룹화
- 레이어 패널
- Undo / Redo
- 정렬 가이드라인
- 스냅 기능
- AI 기반 UI 데이터 생성

AI 기능은 처음부터 넣지 않는다. 먼저 사람이 직접 편집할 수 있는 빌더를 만들고, 이후 AI가 `components` 데이터를 생성하는 보조 기능으로 연결한다.

## 11. 한 줄 요약

Visual UI Code Builder는 **마우스로 UI를 만들면 자동으로 코드가 생성되는 비주얼 UI 빌더**이다.
