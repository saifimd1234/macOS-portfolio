import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { navIcons, navLinks, locations } from '#constants'
import { useWindows } from '#store'
import { useTheme } from '#store/theme'

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { isDark, toggleTheme } = useTheme();
  const { open } = useWindows();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openFromNav = (type, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    if (type === 'finder') {
      open('finder', { singleton: true, data: locations.work, title: 'Portfolio', origin });
    } else if (type === 'resume') {
      open('resume', { singleton: true, title: 'Resume.pdf', origin });
    } else if (type === 'contact') {
      open('contact', { singleton: true, title: 'Contact', origin });
    }
  };

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="Logo" />
        <p className='font-bold text-xl'>Saifi&apos;s Portfolio</p>
        <ul>
          {navLinks.map((item) => (
            <li key={item.id}>
              <p onClick={(e) => openFromNav(item.type, e)}>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => {
            // The "mode" icon (id 4) toggles light / dark theme.
            const isModeToggle = id === 4;
            return (
              <li key={id}>
                <img
                  src={img}
                  className={`icon-hover ${isModeToggle ? "cursor-pointer" : ""}`}
                  alt={isModeToggle ? "Toggle theme" : `icon-${id}`}
                  onClick={isModeToggle ? toggleTheme : undefined}
                  title={isModeToggle ? (isDark ? "Switch to light" : "Switch to dark") : undefined}
                />
              </li>
            );
          })}
        </ul>
        <time>
          {currentTime.format('ddd MMM DD, h:mm:ss A')}
        </time>
      </div>
    </nav>
  )
}

export default Navbar
