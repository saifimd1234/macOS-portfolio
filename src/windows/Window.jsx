import { useRef } from "react";
import gsap from "gsap";
import { useWindows } from "#store";

const TrafficLights = ({ onClose, onMinimize }) => (
  <div className="window-controls">
    <button
      type="button"
      className="close"
      aria-label="Close"
      onClick={onClose}
    />
    <button
      type="button"
      className="minimize"
      aria-label="Minimize"
      onClick={onMinimize}
    />
    <span className="maximize" />
  </div>
);

// 8 resize directions: edges + corners.
const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const MIN_W = 340;
const MIN_H = 220;

/**
 * Generic macOS window chrome: rounded surface, traffic lights, a draggable
 * header, resize handles on every edge/corner, and a minimize animation that
 * flies the window back into the icon it was opened from.
 */
const Window = ({
  id,
  zIndex,
  offset = 0,
  origin = null,
  className = "",
  title,
  headerRight = null,
  resizable = true,
  children,
}) => {
  const { focus, close } = useWindows();
  const rootRef = useRef(null);
  const drag = useRef(null);
  const resize = useRef(null);

  // Pin the element to its current screen box, dropping centering transforms.
  const pinPosition = (el) => {
    const rect = el.getBoundingClientRect();
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.maxWidth = "none";
    el.style.maxHeight = "none";
    el.style.transform = "none";
    el.style.translate = "none";
    el.style.margin = "0";
    return rect;
  };

  /* ---- move ---- */
  const onHeaderPointerDown = (e) => {
    if (e.target.closest(".window-controls")) return;
    focus(id);
    const el = rootRef.current;
    const rect = pinPosition(el);
    drag.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    const el = rootRef.current;
    if (!el || !drag.current) return;
    el.style.left = `${e.clientX - drag.current.dx}px`;
    el.style.top = `${Math.max(28, e.clientY - drag.current.dy)}px`;
  };

  const onPointerUp = () => {
    drag.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  /* ---- resize ---- */
  const onResizePointerDown = (dir) => (e) => {
    e.stopPropagation();
    focus(id);
    const el = rootRef.current;
    const rect = pinPosition(el);
    resize.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      w: rect.width,
      h: rect.height,
      left: rect.left,
      top: rect.top,
    };
    window.addEventListener("pointermove", onResizePointerMove);
    window.addEventListener("pointerup", onResizePointerUp);
  };

  const onResizePointerMove = (e) => {
    const el = rootRef.current;
    const r = resize.current;
    if (!el || !r) return;

    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;
    let { w, h, left, top } = r;

    if (r.dir.includes("e")) w = r.w + dx;
    if (r.dir.includes("s")) h = r.h + dy;
    if (r.dir.includes("w")) {
      w = r.w - dx;
      left = r.left + dx;
    }
    if (r.dir.includes("n")) {
      h = r.h - dy;
      top = r.top + dy;
    }

    if (w < MIN_W) {
      if (r.dir.includes("w")) left = r.left + (r.w - MIN_W);
      w = MIN_W;
    }
    if (h < MIN_H) {
      if (r.dir.includes("n")) top = r.top + (r.h - MIN_H);
      h = MIN_H;
    }

    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    if (r.dir.includes("w")) el.style.left = `${left}px`;
    if (r.dir.includes("n")) el.style.top = `${top}px`;
  };

  const onResizePointerUp = () => {
    resize.current = null;
    window.removeEventListener("pointermove", onResizePointerMove);
    window.removeEventListener("pointerup", onResizePointerUp);
  };

  /* ---- minimize (genie back into the opening icon) ---- */
  const onMinimize = () => {
    const el = rootRef.current;
    if (!el) return;
    pinPosition(el);
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const target = origin ?? { x: cx, y: window.innerHeight };

    gsap.to(el, {
      x: target.x - cx,
      y: target.y - cy,
      scale: 0.04,
      opacity: 0,
      rotate: 1,
      duration: 0.45,
      ease: "power2.in",
      transformOrigin: "center center",
      onComplete: () => close(id),
    });
  };

  return (
    <section
      ref={rootRef}
      className={`window ${className}`}
      style={{
        zIndex,
        translate: offset ? `${offset * 28}px ${offset * 28}px` : undefined,
      }}
      onMouseDown={() => focus(id)}
    >
      <header className="window-header" onPointerDown={onHeaderPointerDown}>
        <TrafficLights onClose={() => close(id)} onMinimize={onMinimize} />
        {title ? <h2>{title}</h2> : <span />}
        {headerRight ?? <span className="w-14" />}
      </header>

      <div className="window-body">{children}</div>

      {resizable &&
        HANDLES.map((dir) => (
          <span
            key={dir}
            className={`resize-handle resize-${dir}`}
            onPointerDown={onResizePointerDown(dir)}
            aria-hidden="true"
          />
        ))}
    </section>
  );
};

export default Window;
