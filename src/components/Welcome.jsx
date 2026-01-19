import React, { useRef } from 'react'


const Welcome = () => {

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    return (
        <section id="welcome">
            <p ref={titleRef}>Hey, I'm Saifi! Welcome to my</p>
            <h1 ref={subtitleRef} className='mt-7'>Portfolio</h1>

            <div className='small-screen'>
                <p>This Portfolio is designed for desktop/tabled screen only.</p>
            </div>
        </section>
    )
}

export default Welcome