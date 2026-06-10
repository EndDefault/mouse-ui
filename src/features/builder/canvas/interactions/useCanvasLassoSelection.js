import { useEffect, useRef, useState } from "react";

const MIN_SELECTION_SIZE = 6;

export function useCanvasLassoSelection({
  canvas,
  components,
  isSpacePressed,
  stageRef,
  onSelectComponents
}) {
  const selectionStartRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [selectionBox, setSelectionBox] = useState(null);

  useEffect(() => {
    if (!selectionBox) {
      return undefined;
    }

    function handleMouseMove(event) {
      const start = selectionStartRef.current;

      if (!start) {
        return;
      }

      const current = toCanvasPoint(event, stageRef, canvas.viewport);

      setSelectionBox(normalizeBox(start, current));
    }

    function handleMouseUp() {
      const box = selectionBox;

      selectionStartRef.current = null;
      setSelectionBox(null);

      if (
        !box ||
        box.width < MIN_SELECTION_SIZE ||
        box.height < MIN_SELECTION_SIZE
      ) {
        return;
      }

      suppressClickRef.current = true;
      onSelectComponents(getComponentsInBox(box, components));
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvas.viewport, components, onSelectComponents, selectionBox, stageRef]);

  function handleSelectionMouseDown(event) {
    if (
      event.button !== 0 ||
      isSpacePressed ||
      !canStartSelectionDrag(event)
    ) {
      return;
    }

    event.preventDefault();
    const start = toCanvasPoint(event, stageRef, canvas.viewport);

    selectionStartRef.current = start;
    setSelectionBox({
      x: start.x,
      y: start.y,
      width: 0,
      height: 0
    });
  }

  function shouldSuppressSelectionClick() {
    if (!suppressClickRef.current) {
      return false;
    }

    suppressClickRef.current = false;
    return true;
  }

  return {
    selectionBox,
    selectionHandlers: {
      onMouseDown: handleSelectionMouseDown
    },
    shouldSuppressSelectionClick
  };
}

function canStartSelectionDrag(event) {
  if (event.target === event.currentTarget) {
    return true;
  }

  const itemFrame = event.target.closest?.(".canvas-item-frame");

  if (!itemFrame || !event.currentTarget.contains(itemFrame)) {
    return false;
  }

  return itemFrame.classList.contains("is-locked");
}

function toCanvasPoint(event, stageRef, viewport) {
  const rect = stageRef.current.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left - viewport.panX) / viewport.zoom,
    y: (event.clientY - rect.top - viewport.panY) / viewport.zoom
  };
}

function normalizeBox(start, current) {
  const x = Math.min(start.x, current.x);
  const y = Math.min(start.y, current.y);

  return {
    x,
    y,
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y)
  };
}

function getComponentsInBox(box, components) {
  const componentsById = new Map(
    components.map((component) => [component.id, component])
  );

  return components
    .filter((component) => !component.locked)
    .filter((component) =>
      intersects(box, getGlobalComponentRect(component, componentsById))
    )
    .map((component) => component.id);
}

function getGlobalComponentRect(component, componentsById) {
  let x = component.x;
  let y = component.y;
  let parentId = component.parentId;

  while (parentId) {
    const parent = componentsById.get(parentId);

    if (!parent) {
      break;
    }

    x += parent.x;
    y += parent.y;
    parentId = parent.parentId;
  }

  return {
    x,
    y,
    width: component.width,
    height: component.height
  };
}

function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
