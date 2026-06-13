import useIconDrag from "#hooks/useIconDrag";

/**
 * An absolutely-positioned, draggable icon (used on the desktop and inside
 * Finder). Double-click opens it (passing its center point so the window can
 * animate from / back to here); a drag repositions it without opening.
 */
const DraggableIcon = ({ className = "", onOpen, title, children }) => {
  const { ref, onPointerDown, dragging } = useIconDrag();

  const handleOpen = () => {
    if (dragging) return;
    const r = ref.current?.getBoundingClientRect();
    const origin = r
      ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      : undefined;
    onOpen?.(origin);
  };

  return (
    <li
      ref={ref}
      className={`select-none ${className}`}
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onDoubleClick={handleOpen}
      title={title}
    >
      {children}
    </li>
  );
};

export default DraggableIcon;
