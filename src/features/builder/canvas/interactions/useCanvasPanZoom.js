import { useEffect, useRef, useState } from "react";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.08;

export function useCanvasPanZoom({ viewport, onChangeViewport }) {
  const stageRef = useRef(null);
  const panPointerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code !== "Space" || isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      setIsSpacePressed(true);
    }

    function handleKeyUp(event) {
      if (event.code === "Space") {
        setIsSpacePressed(false);
        setIsPanning(false);
        panPointerRef.current = null;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  function handleWheel(event) {
    event.preventDefault();
    zoomAtPointer(event);
  }

  function handleMouseDown(event) {
    if (!isSpacePressed) {
      return;
    }

    event.preventDefault();
  }

  function handleMouseMove(event) {
    if (!isSpacePressed) {
      panPointerRef.current = null;
      setIsPanning(false);
      return;
    }

    event.preventDefault();

    if (!panPointerRef.current) {
      panPointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY
      };
      return;
    }

    const deltaX = event.clientX - panPointerRef.current.clientX;
    const deltaY = event.clientY - panPointerRef.current.clientY;

    panPointerRef.current = {
      clientX: event.clientX,
      clientY: event.clientY
    };
    suppressClickRef.current =
      suppressClickRef.current || Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2;
    setIsPanning(true);
    onChangeViewport(
      roundViewport({
        panX: viewport.panX + deltaX,
        panY: viewport.panY + deltaY
      })
    );
  }

  function handleMouseLeave() {
    panPointerRef.current = null;
    setIsPanning(false);
  }

  function shouldSuppressClick() {
    if (!suppressClickRef.current) {
      return false;
    }

    suppressClickRef.current = false;
    return true;
  }

  function zoomAtPointer(event) {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const direction = event.deltaY > 0 ? -1 : 1;
    const zoom = clampZoom(viewport.zoom + direction * ZOOM_STEP);
    const worldX = (pointerX - viewport.panX) / viewport.zoom;
    const worldY = (pointerY - viewport.panY) / viewport.zoom;

    onChangeViewport(
      roundViewport({
        zoom,
        panX: pointerX - worldX * zoom,
        panY: pointerY - worldY * zoom
      })
    );
  }

  return {
    stageRef,
    isSpacePressed,
    isPanning,
    shouldSuppressClick,
    panZoomHandlers: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    }
  };
}

function clampZoom(value) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function roundViewport(viewport) {
  const nextViewport = {};

  if (viewport.zoom != null) {
    nextViewport.zoom = Math.round(clampZoom(viewport.zoom) * 100) / 100;
  }

  if (viewport.panX != null) {
    nextViewport.panX = Math.round(viewport.panX);
  }

  if (viewport.panY != null) {
    nextViewport.panY = Math.round(viewport.panY);
  }

  return nextViewport;
}

function isEditableTarget(target) {
  return ["INPUT", "SELECT", "TEXTAREA"].includes(target?.tagName);
}
