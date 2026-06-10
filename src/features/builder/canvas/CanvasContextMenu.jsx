import { COMPONENT_TYPES } from "../model/componentTypes.js";

const MENU_ITEMS = [
  { type: COMPONENT_TYPES.BUTTON, label: "버튼 추가" },
  { type: COMPONENT_TYPES.TEXT, label: "텍스트 추가" },
  { type: COMPONENT_TYPES.INPUT, label: "input 추가" },
  { type: COMPONENT_TYPES.IMAGE, label: "이미지 추가" },
  { type: COMPONENT_TYPES.DIV_BOX, label: "div 박스 추가" },
  { type: COMPONENT_TYPES.CONTAINER, label: "컨테이너 추가" }
];

export function CanvasContextMenu({
  menu,
  canPaste,
  onAdd,
  onCopy,
  onPaste,
  onDelete,
  onClose
}) {
  if (!menu) {
    return null;
  }

  return (
    <div
      className="canvas-context-menu"
      style={{
        left: menu.clientX,
        top: menu.clientY
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <strong>{menu.componentId ? "객체 메뉴" : "컴포넌트 추가"}</strong>
      {menu.canAddChildren
        ? MENU_ITEMS.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => onAdd(item.type)}
            >
              {item.label}
            </button>
          ))
        : null}
      {menu.componentId ? (
        <>
          <button type="button" onClick={onCopy}>
            복사
          </button>
          <button className="is-danger" type="button" onClick={onDelete}>
            삭제
          </button>
        </>
      ) : null}
      <button type="button" disabled={!canPaste} onClick={onPaste}>
        붙여넣기
      </button>
      <button type="button" onClick={onClose}>
        닫기
      </button>
    </div>
  );
}
