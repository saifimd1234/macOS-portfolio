import { useWindows } from "#store";
import Finder from "./Finder";
import Safari from "./Safari";
import Photos from "./Photos";
import Contact from "./Contact";
import Terminal from "./Terminal";
import Resume from "./Resume";
import TextFile from "./TextFile";
import ImageFile from "./ImageFile";

const registry = {
  finder: Finder,
  safari: Safari,
  photos: Photos,
  contact: Contact,
  terminal: Terminal,
  resume: Resume,
  txtfile: TextFile,
  imgfile: ImageFile,
};

const WindowManager = () => {
  const { windows } = useWindows();

  return (
    <>
      {windows.map((win) => {
        const Component = registry[win.type];
        if (!Component) return null;
        return (
          <Component
            key={win.id}
            id={win.id}
            zIndex={win.zIndex}
            offset={win.offset}
            data={win.data}
            origin={win.origin}
          />
        );
      })}
    </>
  );
};

export default WindowManager;
