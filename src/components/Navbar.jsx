import { navIcons, navLinks } from '#constants'
import React from 'react'


const Navbar = () => {
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
        </div>
    </nav>
  )
}

export default Navbar