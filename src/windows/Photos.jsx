import { gallery, photosLinks } from "#constants";
import Window from "./Window";

const Photos = (props) => (
  <Window {...props} className="photos" title="Gallery">
    <div className="photos-body">
      <aside className="sidebar">
        <h2>Photos</h2>
        <ul>
          {photosLinks.map(({ id, icon, title }) => (
            <li key={id}>
              <img src={icon} alt={title} />
              <p>{title}</p>
            </li>
          ))}
        </ul>
      </aside>

      <div className="gallery">
        <ul>
          {gallery.map(({ id, img }) => (
            <li key={id}>
              <img src={img} alt={`gallery-${id}`} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Window>
);

export default Photos;
