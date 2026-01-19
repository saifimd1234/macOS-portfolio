import { navLinks } from '#constants'
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
    </nav>
  )
}

export default Navbar