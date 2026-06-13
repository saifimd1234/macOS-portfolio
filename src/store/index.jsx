/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { INITIAL_Z_INDEX } from "#constants";

/**
 * Window-manager store (macOS desktop).
 *
 * Each open window is a plain object:
 *   { id, type, title, data, key, singleton, zIndex, offset }
 *
 * - Dock apps open as singletons (one window per type, re-click focuses it).
 * - Folders / files open as many windows as you like (multiple finders, etc.).
 * - The most recently focused window gets the highest zIndex, so clicking a
 *   window brings it to the front — exactly like macOS.
 */

const WindowsContext = createContext(null);

let uid = 0;
const nextId = () => `win-${++uid}`;

export const WindowsProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const zRef = useRef(INITIAL_Z_INDEX);

  const focus = useCallback((id) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === id);
      // Already on top — nothing to do (avoids an extra render).
      if (!target || target.zIndex === zRef.current) return prev;
      const z = ++zRef.current;
      return prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w));
    });
  }, []);

  const close = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  /**
   * Open a window.
   * @param {string} type   one of finder | safari | photos | contact |
   *                        terminal | resume | txtfile | imgfile
   * @param {object} opts   { data, title, key, singleton }
   *   - singleton: only one window of this type may exist (dock apps).
   *   - key: dedupe identical content (e.g. the same image / text file).
   */
  const open = useCallback((type, opts = {}) => {
    const {
      data = null,
      title = "",
      key = null,
      singleton = false,
      origin = null,
    } = opts;

    setWindows((prev) => {
      const existing = prev.find((w) => {
        if (singleton) return w.type === type && w.singleton;
        if (key) return w.key === key;
        return false;
      });

      const z = ++zRef.current;

      if (existing) {
        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, zIndex: z, data, title, origin: origin ?? w.origin }
            : w
        );
      }

      return [
        ...prev,
        {
          id: nextId(),
          type,
          title,
          data,
          key,
          singleton,
          origin,
          zIndex: z,
          offset: prev.length % 6,
        },
      ];
    });
  }, []);

  const isOpen = useCallback(
    (type) => windows.some((w) => w.type === type && w.singleton),
    [windows]
  );

  const value = useMemo(
    () => ({ windows, open, close, focus, isOpen }),
    [windows, open, close, focus, isOpen]
  );

  return (
    <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>
  );
};

export const useWindows = () => {
  const ctx = useContext(WindowsContext);
  if (!ctx) throw new Error("useWindows must be used within <WindowsProvider>");
  return ctx;
};
