import React, { useRef } from 'react'

const FONT_WEIGHTS = {
    subtitle: {min: 100, max: 400, default: 100},
    title: {min: 400, max: 900, default: 400},
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, index) => (
        <span
            key={index}
            className={className}
            style={{
                fontVariationSettings: `"wght" ${baseWeight}`,
            }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}

const setupTextHover = (container, type) => {
    if(!container) return;

    const letters = container.querySelectorAll("span");
    const {min, max, default: base} = FONT_WEIGHTS[type];

}

const Welcome = () => {

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    return (
        <section id="welcome">
            <p ref={titleRef}>
                {renderText(
                    "Hey, I'm Saifi! Welcome to my",
                    "text-3xl font-georama",
                    100,
                )}
            </p>
            <h1 ref={subtitleRef} className='mt-7'>
                {renderText(
                    "portfolio",
                    "text-9xl italic font-georama",
                    400,
                )}
            </h1>

            <div className='small-screen'>
                <p>This Portfolio is designed for desktop/tabled screen only.</p>
            </div>
        </section>
    )
}

export default Welcome