import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Moon,
  Signal,
  Sun,
  Wifi,
  BatteryFull,
} from "lucide-react";
import {
  blogPosts,
  gallery,
  locations,
  socials,
  techStack,
} from "#constants";
import { useTheme } from "#store/theme";

/* ------------------------------------------------------------------ *
 *  App registry for the phone home screen
 * ------------------------------------------------------------------ */
const apps = [
  { id: "portfolio", label: "Projects", icon: "/images/finder.png" },
  { id: "articles", label: "Articles", icon: "/images/safari.png" },
  { id: "gallery", label: "Gallery", icon: "/images/photos.png" },
  { id: "skills", label: "Skills", icon: "/images/terminal.png" },
  { id: "about", label: "About", icon: "/images/folder.png" },
  { id: "resume", label: "Resume", icon: "/images/pdf.png" },
  { id: "contact", label: "Contact", icon: "/images/contact.png" },
];

const partsOf = (project) => {
  const find = (type) =>
    (project.children ?? []).find((c) => c.fileType === type);
  return {
    txt: find("txt"),
    img: find("img"),
    url: find("url"),
    fig: find("fig"),
  };
};

/* ------------------------------------------------------------------ *
 *  Per-app mobile screens
 * ------------------------------------------------------------------ */
const Projects = () => (
  <div className="m-screen">
    <h1>Projects</h1>
    {locations.work.children.map((project) => {
      const { txt, img, url, fig } = partsOf(project);
      return (
        <article key={project.id} className="m-card">
          {img?.imageUrl && <img src={img.imageUrl} alt={project.name} />}
          <h2>{project.name}</h2>
          {txt?.description?.[0] && <p>{txt.description[0]}</p>}
          <div className="m-actions">
            {url?.href && (
              <a href={url.href} target="_blank" rel="noopener noreferrer">
                Live <ArrowUpRight className="size-3.5" />
              </a>
            )}
            {fig?.href && (
              <a href={fig.href} target="_blank" rel="noopener noreferrer">
                Design <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
        </article>
      );
    })}
  </div>
);

const About = () => {
  const txt = locations.about.children.find((c) => c.fileType === "txt");
  const imgs = locations.about.children.filter((c) => c.fileType === "img");
  return (
    <div className="m-screen">
      <h1>About</h1>
      <div className="m-gallery">
        {imgs.map((c) => (
          <img key={c.id} src={c.imageUrl} alt={c.name} />
        ))}
      </div>
      {txt?.subtitle && <h2>{txt.subtitle}</h2>}
      {(txt?.description ?? []).map((line, i) => (
        <p key={i} className="m-paragraph">
          {line}
        </p>
      ))}
    </div>
  );
};

const Articles = () => (
  <div className="m-screen">
    <h1>Articles</h1>
    {blogPosts.map((post) => (
      <a
        key={post.id}
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="m-card"
      >
        <img src={post.image} alt={post.title} />
        <p className="m-date">{post.date}</p>
        <h2>{post.title}</h2>
      </a>
    ))}
  </div>
);

const Gallery = () => (
  <div className="m-screen">
    <h1>Gallery</h1>
    <div className="m-gallery">
      {gallery.map(({ id, img }) => (
        <img key={id} src={img} alt={`gallery-${id}`} />
      ))}
    </div>
  </div>
);

const Skills = () => (
  <div className="m-screen">
    <h1>Skills</h1>
    {techStack.map(({ category, items }) => (
      <div key={category} className="m-skill">
        <h2>{category}</h2>
        <ul>
          {items.map((item) => (
            <li key={item}>
              <Check className="size-3.5 text-green-600" /> {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const ResumeScreen = () => (
  <div className="m-screen">
    <h1>Resume</h1>
    <iframe className="m-resume" src="/files/resume.pdf" title="Resume" />
    <a className="m-resume-link" href="/files/resume.pdf" download>
      Download PDF
    </a>
  </div>
);

const ContactScreen = () => (
  <div className="m-screen">
    <h1>Contact</h1>
    <p className="m-paragraph">Let&apos;s build something together.</p>
    <div className="m-socials">
      {socials.map(({ id, text, icon, bg, link }) => (
        <a
          key={id}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: bg }}
        >
          <img src={icon} alt={text} className="size-7" />
          <span>{text}</span>
        </a>
      ))}
    </div>
  </div>
);

const screens = {
  portfolio: Projects,
  about: About,
  articles: Articles,
  gallery: Gallery,
  skills: Skills,
  resume: ResumeScreen,
  contact: ContactScreen,
};

/* ------------------------------------------------------------------ *
 *  iPhone shell
 * ------------------------------------------------------------------ */
const MobileView = () => {
  const [activeApp, setActiveApp] = useState(null);
  const [now, setNow] = useState(dayjs());
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const t = setInterval(() => setNow(dayjs()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const ActiveScreen = activeApp ? screens[activeApp] : null;
  const activeLabel = apps.find((a) => a.id === activeApp)?.label;

  return (
    <div className="iphone-stage">
      <div className="iphone">
        <div className="notch" />

        <div className="status-bar">
          <span>{now.format("h:mm")}</span>
          <span className="status-icons">
            <Signal className="size-3.5" />
            <Wifi className="size-3.5" />
            <BatteryFull className="size-4" />
          </span>
        </div>

        {/* Home screen */}
        {!activeApp && (
          <div className="home-screen">
            <div className="home-top">
              <p className="hello">Hey, I&apos;m Saifi 👋</p>
              <button
                type="button"
                className="theme-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </div>

            <div className="app-grid">
              {apps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="app-icon"
                  onClick={() => setActiveApp(app.id)}
                >
                  <img src={app.icon} alt={app.label} />
                  <span>{app.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* A single open app */}
        {activeApp && (
          <div className="app-view">
            <div className="app-bar">
              <button
                type="button"
                onClick={() => setActiveApp(null)}
                aria-label="Back to home"
              >
                <ArrowLeft className="size-5" />
              </button>
              <span>{activeLabel}</span>
              <span className="w-5" />
            </div>
            <div className="app-content">{ActiveScreen && <ActiveScreen />}</div>
          </div>
        )}

        <button
          type="button"
          className="home-indicator"
          onClick={() => setActiveApp(null)}
          aria-label="Home"
        />
      </div>
    </div>
  );
};

export default MobileView;
