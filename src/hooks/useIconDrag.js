import { useRef, useState } from "react";

const THRESHOLD = 4; // px the pointer must move before it counts as a drag

/**
 * Makes a desktop / finder icon draggable within its positioned parent.
 * Returns a ref to attach to the element, a pointer-down handler, and a
 * `dragging` flag so callers can suppress the "open" action after a drag.
 */
const useIconDrag = () => {
  const ref = useRef(null);
  const state = useRef(null);
  const [dragging, setDragging] = useState(false);

  const onPointerMove = (e) => {
    const s = state.current;
    const el = ref.current;
    if (!s || !el) return;

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;

    if (!s.moved && Math.hypot(dx, dy) < THRESHOLD) return;

    if (!s.moved) {
      s.moved = true;
      setDragging(true);
      // Switch to absolute left/top positioning, dropping any right/bottom anchors.
      el.style.right = "auto";
      el.style.bottom = "auto";
    }

    // Keep the icon inside its container on every side.
    const parent = s.parent;
    const maxLeft = Math.max(0, parent.clientWidth - el.offsetWidth);
    const maxTop = Math.max(0, parent.clientHeight - el.offsetHeight);
    const left = Math.min(Math.max(0, s.originLeft + dx), maxLeft);
    const top = Math.min(Math.max(0, s.originTop + dy), maxTop);

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const onPointerUp = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    if (state.current) {
      state.current = null;
      // Clear after the click/double-click has had a chance to read it.
      setTimeout(() => setDragging(false), 0);
    }
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    e.stopPropagation();

    const parent = el.offsetParent || el.parentElement;
    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    state.current = {
      startX: e.clientX,
      startY: e.clientY,
      originLeft: elRect.left - parentRect.left,
      originTop: elRect.top - parentRect.top,
      parent,
      moved: false,
    };

    el.setPointerCapture?.(e.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return { ref, onPointerDown, dragging };
};

export default useIconDrag;
