import { useEffect, useState } from "react";
import { desktopItems, locations } from "#constants";
import { useWindows } from "#store";
import DraggableIcon from "#components/DraggableIcon.jsx";

const iconFor = (key) =>
  key === "trash" ? "/images/trash.png" : "/images/folder.png";

const Desktop = () => {
  const { open } = useWindows();
  const [navHeight, setNavHeight] = useState(0);

  // Keep the desktop area below the menu bar so icons can't be dragged over it.
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector("nav");
      if (nav) setNavHeight(nav.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const openLocation = (loc, origin) =>
    open("finder", { data: loc, title: loc.name, origin });

  return (
    <section id="home" style={{ top: navHeight }}>
      <ul>
        {desktopItems.map(({ key, desktopPosition }) => {
          const loc = locations[key];
          return (
            <DraggableIcon
              key={key}
              className={`group cursor-pointer ${desktopPosition}`}
              onOpen={(origin) => openLocation(loc, origin)}
              title={`Double-click to open ${loc.name}`}
            >
              <img
                src={iconFor(key)}
                alt={loc.name}
                className="size-16"
                draggable={false}
              />
              <p>{loc.name}</p>
            </DraggableIcon>
          );
        })}
      </ul>
    </section>
  );
};

export default Desktop;
