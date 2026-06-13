# macOS Portfolio

An interactive portfolio styled like macOS on desktop and like an iPhone on
mobile. Open multiple draggable, resizable windows from the dock, the desktop
folders, or the top menu bar; switch between light and dark themes.

Built with **React 19**, **Vite**, **Tailwind CSS v4**, and **GSAP**.

---

## Quick start

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into /dist
npm run preview  # preview the production build
npm run lint     # run ESLint
```

---

## How it works

- **Desktop (> 640px):** a macOS desktop with a menu bar, dock, and desktop
  folder icons. You can open **many windows at once**; clicking a window brings
  it to the front (z-index focus). Windows are **draggable** by their title bar,
  Finder windows are **resizable** from the bottom-right corner, and file/folder
  icons are **draggable** within the desktop and Finder.
- **Mobile (≤ 640px):** the same content rendered as an iPhone home screen.
  Only **one app is open at a time**, with a back button / home indicator.
- **Theme:** the ☾/☀ icon in the menu bar (and on the phone home screen) toggles
  light/dark mode. The choice is saved in `localStorage`.

### Where the code lives

| Path | What it is |
| --- | --- |
| `src/constants/index.js` | **All content** — edit this to make it your portfolio |
| `src/store/index.jsx` | Window manager (open/close/focus, z-index) |
| `src/store/theme.jsx` | Light/dark theme provider |
| `src/windows/` | Window components (Finder, Safari, Photos, Contact, Terminal, Resume, file viewers) |
| `src/components/` | Navbar, Dock, Welcome, Desktop, MobileView, DraggableIcon |
| `src/index.css` | All styling (Tailwind v4 + custom component classes) |
| `public/images/`, `public/icons/`, `public/files/` | Images, icons, and the résumé PDF |

---

## Updating the content (make it *your* portfolio)

Almost everything you need to change is in **`src/constants/index.js`**. The
starter ships with placeholder content — replace it as follows.

### 1. Your name & title

- **Menu bar / browser title:** edit `src/components/Navbar.jsx` (the
  `Saifi's Portfolio` text) and `index.html` (`<title>`).
- **Welcome headline:** edit the two `renderText(...)` strings in
  `src/components/Welcome.jsx`.
- **Mobile greeting:** edit the `Hey, I'm Saifi 👋` line in
  `src/components/MobileView.jsx`.

### 2. Projects  → `WORK_LOCATION` in `src/constants/index.js`

Each project is a **folder** with `children` (the files shown inside it):

```js
{
  id: 5,
  name: "My Cool Project",          // folder + window title
  icon: "/images/folder.png",
  kind: "folder",
  position: "top-10 left-5",        // icon position inside Finder
  windowPosition: "top-[5vh] left-5",
  children: [
    {
      name: "About.txt",            // opens a text window
      icon: "/images/txt.png",
      kind: "file", fileType: "txt",
      position: "top-5 left-10",
      description: ["Line 1...", "Line 2..."],
    },
    {
      name: "myproject.com",        // opens the URL in a new tab
      icon: "/images/safari.png",
      kind: "file", fileType: "url",
      href: "https://example.com",
      position: "top-10 right-20",
    },
    {
      name: "screenshot.png",       // opens an image window
      icon: "/images/image.png",
      kind: "file", fileType: "img",
      imageUrl: "/images/project-1.png",
      position: "top-52 right-80",
    },
    {
      name: "Design.fig",           // opens the URL in a new tab
      icon: "/images/plain.png",
      kind: "file", fileType: "fig",
      href: "https://figma.com/...",
      position: "top-60 right-20",
    },
  ],
},
```

- Add/remove projects by editing the `children` array of `WORK_LOCATION`.
- Drop project screenshots into `public/images/` and point `imageUrl` at them.
- `fileType` controls what opens: `txt` → text window, `img` → image window,
  `url` / `fig` → opens `href` in a new browser tab.
- `position` is any Tailwind position utility (`top-10 left-5`, `top-52 right-80`)
  — it sets where the icon sits inside the window.

### 3. About you  → `ABOUT_LOCATION`

Update the `me.png` images (`imageUrl`) and the `about-me.txt` entry's
`subtitle` and `description` lines. Replace the photos in `public/images/`
(`adrian.jpg`, `adrian-2.jpg`, `adrian-3.jpeg`) or change the paths.

### 4. Résumé  → `public/files/resume.pdf`

Replace `public/files/resume.pdf` with your own PDF (keep the filename, or update
`RESUME_URL` in `src/windows/Resume.jsx` and the path in `MobileView.jsx`). It
previews inline when you open **Resume** from the dock-less menu bar, the Finder
sidebar, or the desktop folder.

### 5. Skills  → `techStack`

```js
{ category: "Frontend", items: ["React.js", "Next.js", "TypeScript"] },
```

Add, remove, or rename categories and items. They render in the **Skills**
(Terminal) window and on the mobile Skills screen.

### 6. Articles  → `blogPosts`

Each post has `date`, `title`, `image` (in `public/images/`), and `link`.
Shown in the **Articles** (Safari) window and mobile Articles screen.

### 7. Social links  → `socials`

```js
{ id: 1, text: "Github", icon: "/icons/github.svg", bg: "#f4656b", link: "https://github.com/you" },
```

`bg` is the card colour; `icon` is an SVG in `public/icons/`. Shown in the
**Contact** window and mobile Contact screen. **Replace the placeholder
`jsmastery` links with your own.**

### 8. Gallery  → `gallery` and `photosLinks`

`gallery` is the grid of images in the **Gallery** (Photos) window
(swap the images in `public/images/`). `photosLinks` is the sidebar list.

### 9. Dock & menu-bar items

- **Dock apps:** `dockApps` — rename, reorder, or set `canOpen: false` to disable.
- **Menu-bar links:** `navLinks` — `type` must be one of `finder`, `contact`,
  or `resume`.
- **Desktop folders:** `desktopItems` — which `locations` appear on the desktop
  and where (`desktopPosition` is a Tailwind position class).

---

## Customizing styles

All styling is in `src/index.css`, organized by component class
(`.finder`, `.safari`, `.contact`, `.iphone`, etc.). Dark-mode variants use the
`dark:` prefix (class-based, toggled on `<html>`). The desktop wallpaper is set
on `body` — replace `public/images/wallpaper.png` to change it.

---

## Path aliases

Imports use `#`-prefixed aliases (configured in `vite.config.js` and
`jsconfig.json`):

| Alias | Folder |
| --- | --- |
| `#components` | `src/components` |
| `#constants` | `src/constants` |
| `#store` | `src/store` |
| `#windows` | `src/windows` |
| `#hooks` | `src/hooks` |
