import { useEffect, useState } from "react";

export function useCanvasContextMenu({
  selectedIds = [],
  onAddComponent,
  onCopyComponents,
  onPasteComponents,
  onDeleteComponent
}) {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    if (!menu) {
      return undefined;
    }

    function handleWindowClick() {
      closeMenu();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("click", handleWindowClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menu]);

  function openMenu(nextMenu) {
    setMenu(nextMenu);
  }

  function closeMenu() {
    setMenu(null);
  }

  function addComponentToContainer(type) {
    if (!menu || !menu.canAddChildren) {
      return;
    }

    onAddComponent(type, {
      parentId: menu.componentId ?? null,
      x: Math.max(8, Math.round(menu.localX)),
      y: Math.max(8, Math.round(menu.localY))
    });
    closeMenu();
  }

  function deleteComponentFromMenu() {
    if (!menu?.componentId) {
      return;
    }

    onDeleteComponent(menu.componentId);
    closeMenu();
  }

  function copyComponentFromMenu() {
    if (!menu?.componentId) {
      return;
    }

    const ids =
      selectedIds.includes(menu.componentId) && selectedIds.length > 1
        ? selectedIds
        : [menu.componentId];

    onCopyComponents(ids);
    closeMenu();
  }

  function pasteComponentFromMenu() {
    if (!menu) {
      return;
    }

    onPasteComponents({
      parentId: menu.componentId ?? null,
      x: Math.max(8, Math.round(menu.localX)),
      y: Math.max(8, Math.round(menu.localY))
    });
    closeMenu();
  }

  return {
    menu,
    openMenu,
    closeMenu,
    addComponentToContainer,
    copyComponentFromMenu,
    pasteComponentFromMenu,
    deleteComponentFromMenu
  };
}
