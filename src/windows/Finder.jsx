import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { locations } from "#constants";
import { useWindows } from "#store";
import DraggableIcon from "#components/DraggableIcon.jsx";
import Window from "./Window";

const sidebarOrder = ["work", "about", "resume", "trash"];

const Finder = ({ id, zIndex, offset, origin, data }) => {
  const { open } = useWindows();
  const [node, setNode] = useState(data ?? locations.work);

  const openChild = (child, childOrigin) => {
    if (child.kind === "folder") {
      open("finder", { data: child, title: child.name, origin: childOrigin });
      return;
    }

    switch (child.fileType) {
      case "txt":
        open("txtfile", {
          data: child,
          title: child.name,
          key: `txt-${node.id}-${child.id}`,
          origin: childOrigin,
        });
        break;
      case "img":
        open("imgfile", {
          data: child,
          title: child.name,
          key: `img-${child.imageUrl}`,
          origin: childOrigin,
        });
        break;
      case "pdf":
        open("resume", { singleton: true, title: "Resume.pdf", origin: childOrigin });
        break;
      case "url":
      case "fig":
        if (child.href) window.open(child.href, "_blank", "noopener");
        break;
      default:
        break;
    }
  };

  return (
    <Window
      id={id}
      zIndex={zIndex}
      offset={offset}
      origin={origin}
      className="finder"
      title={node.name}
    >
      <div className="finder-body">
        <aside className="sidebar">
          <h3>Locations</h3>
          <ul>
            {sidebarOrder.map((key) => {
              const loc = locations[key];
              return (
                <li
                  key={key}
                  className={loc.id === node.id ? "active" : "not-active"}
                  onClick={() => setNode(loc)}
                >
                  <img src={loc.icon} alt={loc.name} className="w-4" />
                  <span>{loc.name}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="content">
          <ul>
            {(node.children ?? []).map((child) => (
              <DraggableIcon
                key={child.id}
                className={`group cursor-pointer ${child.position ?? "top-10 left-10"}`}
                onOpen={(childOrigin) => openChild(child, childOrigin)}
                title={`Double-click to open ${child.name}`}
              >
                <img src={child.icon} alt={child.name} draggable={false} />
                <p>{child.name}</p>
                {child.fileType === "url" || child.fileType === "fig" ? (
                  <span className="link-hint">
                    open <ChevronRight className="size-3" />
                  </span>
                ) : null}
              </DraggableIcon>
            ))}
            {(node.children ?? []).length === 0 && (
              <li className="top-10 left-10 !static text-sm text-gray-400">
                <p>This folder is empty.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Window>
  );
};

export default Finder;
