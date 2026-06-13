import { useEffect, useState } from "react";

const QUERY = "(max-width: 640px)";

/**
 * Returns true on phone-sized viewports (Tailwind's `sm` breakpoint).
 * Used to switch between the macOS desktop and the iPhone experience.
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
