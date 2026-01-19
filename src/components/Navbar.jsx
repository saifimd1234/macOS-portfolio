import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { navIcons, navLinks } from '#constants'



const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="Logo" />
        <p className='font-bold text-xl'>Saifi's Portfolio</p>
        <ul>
          {navLinks.map((item) => (
            <li key={item.id}>
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>
        <time>
          {currentTime.format('ddd MMM DD, h:mm:ss A')}
        </time>
      </div>
    </nav>
  )
}

export default Navbar